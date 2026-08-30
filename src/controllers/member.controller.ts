import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import MemberService from "../models/Member.service";
import AuthService from "../models/Auth.service";
import { LoginInput, MemberInput, MemberUpdateInput } from "../libs/types/member";
import { AUTH_TIMER } from "../libs/config";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();
const memberService = new MemberService();
const authService = new AuthService();
const memberController: T = {};

const isProduction = process.env.NODE_ENV === "production";

/** Helper: Extract JWT Token from Cookie or Bearer Header **/
const extractToken = (req: Request): string | undefined => {
  if (req.cookies && req.cookies["accessToken"]) {
    return req.cookies["accessToken"];
  }
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return undefined;
};

/** SPA: Get Restaurant Details **/
memberController.getRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getRestaurant();

    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getRestaurant:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Get Top 4 Active Users **/
memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();

    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: User Signup (Generates JWT & Sets accessToken Cookie) **/
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    const input: MemberInput = req.body;
    const result = await memberService.signup(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(HTTPCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, signup:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: User Login (Verifies & Generates JWT & Sets accessToken Cookie) **/
memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body;
    const result = await memberService.login(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(HTTPCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Google OAuth 1-Click Login **/
memberController.googleLogin = async (req: Request, res: Response) => {
  try {
    console.log("googleLogin");
    const { credential, userData } = req.body;

    let googleData = userData;

    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({ idToken: credential });
        const payload = ticket.getPayload();
        if (payload) {
          googleData = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.given_name || "Google User",
            picture: payload.picture,
          };
        }
      } catch {
        const decoded = JSON.parse(
          Buffer.from(credential.split(".")[1], "base64").toString()
        );
        googleData = {
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name || "Google User",
          picture: decoded.picture,
        };
      }
    }

    if (!googleData || !googleData.email) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    const result = await memberService.googleLogin(googleData);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(HTTPCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, googleLogin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: User Logout (Clears accessToken Cookie) **/
memberController.logout = (req: Request, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accessToken", null, {
      maxAge: 0,
      httpOnly: false,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.status(HTTPCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Get Authenticated Member Detail **/
memberController.getMemberDetail = async (req: Request, res: Response) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member!);

    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Update Member Profile **/
memberController.updateMember = async (req: Request, res: Response) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;
    if (req.file) {
      input.memberImage = req.file.path.replace(/\\/g, "/");
    }

    const result = await memberService.updateMember(req.member!, input);
    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateMember:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Middleware: Mandatory Authentication Verification **/
memberController.verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (token) req.member = await authService.checkAuth(token);

    if (!req.member) {
      throw new Errors(HTTPCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }
    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Middleware: Optional Authentication Retrieval **/
memberController.retrieveAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (token) req.member = await authService.checkAuth(token);
    next();
  } catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }
};

export default memberController;
