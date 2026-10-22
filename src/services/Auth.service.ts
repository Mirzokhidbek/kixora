import jwt from "jsonwebtoken";
import { Member } from "../libs/types/member";
import { AUTH_TIMER } from "../libs/config";
import Errors, { HTTPCode, Message } from "../libs/Errors";

class AuthService {
  private readonly secretToken: string;

  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string || "BURAK_AUTH_SECRET_KEY_2026";
  }

  public async createToken(payload: Member): Promise<string> {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        this.secretToken,
        {
          expiresIn: duration,
        },
        (err, token) => {
          if (err) {
            console.error("Error, createToken:", err);
            reject(new Errors(HTTPCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED));
          } else {
            resolve(token as string);
          }
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretToken, (err, decode) => {
        if (err) {
          console.error("Error, checkAuth:", err);
          reject(new Errors(HTTPCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED));
        } else {
          resolve(decode as Member);
        }
      });
    });
  }
}

export default AuthService;
