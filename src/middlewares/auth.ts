import { NextFunction, Request, Response } from "express";
import AuthService from "../services/Auth.service";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import { sendAdminAlert } from "../libs/adminResponse";

const authService = new AuthService();

/** Reads the JWT from the httpOnly cookie or an `Authorization: Bearer` header */
const extractToken = (req: Request): string | undefined => {
  const cookieToken = req.cookies?.["accessToken"];
  if (cookieToken) return cookieToken;
  const header = req.headers["authorization"];
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  return undefined;
};

/** SPA: mandatory authentication */
export const verifyAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) throw new Errors(HTTPCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
  req.member = await authService.checkAuth(token);
  next();
};

/** SPA: optional authentication (invalid/expired tokens are ignored) */
export const retrieveAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token) req.member = await authService.checkAuth(token).catch(() => undefined);
  next();
};

/** Admin (BSSR): session must belong to the store admin account */
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const member = req.session?.member;
  if (member?.memberType === MemberType.RESTAURANT) {
    req.member = { _id: String(member._id), memberType: member.memberType, memberNick: member.memberNick };
    return next();
  }
  // AJAX calls get JSON, page navigations get the login redirect
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(HTTPCode.UNAUTHORIZED).json({ code: HTTPCode.UNAUTHORIZED, message: Message.NOT_AUTHENTICATED });
  }
  sendAdminAlert(res, Message.NOT_AUTHENTICATED, "/admin/login", HTTPCode.UNAUTHORIZED);
};
