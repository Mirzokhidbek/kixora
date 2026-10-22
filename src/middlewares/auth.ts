import { NextFunction, Request, Response } from "express";
import AuthService from "../services/Auth.service";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import { sendAdminAlert } from "../libs/adminResponse";
import { cache } from "../libs/cache";
import MemberModel from "../models/Member.model";
import { MemberStatus } from "../libs/enums/member.enum";
import { AuthPayload } from "../libs/types/member";

const STATUS_TTL_SECONDS = 30;
export const memberStatusKey = (memberId: string) => `member:status:${memberId}`;

/**
 * A JWT stays valid for 24h, so the account status is checked on every request
 * (cached for 30s, and the cache is dropped as soon as an admin changes a status).
 * A blocked or deleted member is locked out immediately instead of at token expiry.
 */
async function isActiveMember(payload: AuthPayload): Promise<boolean> {
  const key = memberStatusKey(payload._id);
  let status = await cache.get<string>(key);
  if (!status) {
    const member = await MemberModel.findById(payload._id).select("memberStatus").lean<{ memberStatus: string }>().exec();
    status = member?.memberStatus || MemberStatus.DELETE;
    await cache.set(key, status, STATUS_TTL_SECONDS);
  }
  return status === MemberStatus.ACTIVE;
}

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
  const payload = await authService.checkAuth(token);
  if (!(await isActiveMember(payload))) throw new Errors(HTTPCode.FORBIDDEN, Message.BLOCKED_USER);
  req.member = payload;
  next();
};

/** SPA: optional authentication (invalid/expired tokens are ignored) */
export const retrieveAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token) {
    const payload = await authService.checkAuth(token).catch(() => undefined);
    if (payload && (await isActiveMember(payload))) req.member = payload;
  }
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
