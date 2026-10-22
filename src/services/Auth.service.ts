import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Member, GoogleAuthInput, AuthPayload } from "../libs/types/member";
import { AUTH_TIMER, env } from "../libs/config";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { logger } from "../libs/logger";

const FIREBASE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

class AuthService {
  private readonly secretToken = env.jwtSecret;
  private readonly googleClient = new OAuth2Client();
  private firebaseCerts: { certs: Record<string, string>; expiresAt: number } | null = null;

  /** The token carries only identity + role; profile data is always read from the DB */
  public async createToken(member: Member): Promise<string> {
    const payload: AuthPayload = {
      _id: String(member._id),
      memberType: member.memberType,
      memberNick: member.memberNick,
    };
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretToken, { expiresIn: `${AUTH_TIMER}h` }, (err, token) => {
        if (err || !token) {
          logger.error("JWT creation failed", { err });
          reject(new Errors(HTTPCode.INTERNAL_SERVER_ERROR, Message.TOKEN_CREATION_FAILED));
        } else {
          resolve(token);
        }
      });
    });
  }

  public async checkAuth(token: string): Promise<AuthPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretToken, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
          reject(new Errors(HTTPCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED));
        } else {
          resolve(decoded as AuthPayload);
        }
      });
    });
  }

  /**
   * Verifies a Google identity token SIGNATURE before trusting any claim in it.
   * Accepts either a Firebase Auth ID token (current web client) or a Google
   * Identity Services ID token (when GOOGLE_CLIENT_ID is configured).
   */
  public async verifyGoogleCredential(credential: string): Promise<GoogleAuthInput> {
    const payload = await this.verifyFirebaseIdToken(credential).catch(() =>
      this.verifyGoogleIdToken(credential)
    ).catch(() => null);

    if (!payload || !payload.sub || !payload.email || payload.email_verified !== true) {
      throw new Errors(HTTPCode.UNAUTHORIZED, Message.INVALID_GOOGLE_TOKEN);
    }

    return {
      googleId: String(payload.sub),
      email: String(payload.email).toLowerCase(),
      name: String(payload.name || payload.given_name || String(payload.email).split("@")[0]),
      picture: payload.picture ? String(payload.picture) : undefined,
    };
  }

  private async verifyFirebaseIdToken(token: string) {
    const certs = await this.getFirebaseCerts();
    const projectId = env.firebaseProjectId;
    const ticket = await this.googleClient.verifySignedJwtWithCertsAsync(
      token,
      certs,
      projectId,
      [`https://securetoken.google.com/${projectId}`]
    );
    return ticket.getPayload() as Record<string, any> | undefined;
  }

  private async verifyGoogleIdToken(token: string) {
    if (!env.googleClientId) throw new Error("GOOGLE_CLIENT_ID not configured");
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: env.googleClientId,
    });
    return ticket.getPayload() as Record<string, any> | undefined;
  }

  /** Firebase signing certificates, cached per Google's Cache-Control max-age */
  private async getFirebaseCerts(): Promise<Record<string, string>> {
    if (this.firebaseCerts && this.firebaseCerts.expiresAt > Date.now()) {
      return this.firebaseCerts.certs;
    }
    const response = await fetch(FIREBASE_CERTS_URL, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Failed to fetch Firebase certs: ${response.status}`);
    const certs = (await response.json()) as Record<string, string>;
    const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get("cache-control") || "")?.[1] || 3600);
    this.firebaseCerts = { certs, expiresAt: Date.now() + maxAge * 1000 };
    return certs;
  }
}

export default AuthService;
