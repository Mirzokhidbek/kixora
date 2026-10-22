import { NextFunction, Request, Response } from "express";
import AuthService from "../services/Auth.service";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import { sendAdminAlert } from "../libs/adminResponse";
import { cache } from "../libs/cache";
import MemberModel from "../models/Member.model";
import { MemberStatus } from "../libs/enums/member.enum";
import { AuthPayload } from "../libs/types/member";
import { safeEqual } from "../libs/crypto";

const STATUS_TTL_SECONDS = 30;
export const memberStatusKey = (memberId: string) => `member:status:${memberId}`;

/**
 * A JWT stays valid for 24h, so the account status is checked on every request
 * (cached for 30s, and the cache is dropped as soon as an admin changes a status).
 * A blocked or deleted member is locked out immediately instead of at token expiry.
 */
async function isActiveMember(payload: AuthPayload): Promise<boolean> {
  const key = memberStatusKey(payload._id);
  let state = await cache.get<{ status: string; pwdAt: number }>(key);
  if (!state) {
    const member = await MemberModel.findById(payload._id)
      .select("memberStatus passwordChangedAt")
      .lean<{ memberStatus: string; passwordChangedAt?: Date }>()
      .exec();
    state = {
      status: member?.memberStatus || MemberStatus.DELETE,
      pwdAt: member?.passwordChangedAt ? Math.floor(new Date(member.passwordChangedAt).getTime() / 1000) : 0,
    };
    await cache.set(key, state, STATUS_TTL_SECONDS);
  }
  // tokens issued before a password reset no longer work
  if (state.pwdAt && (payload.iat ?? 0) < state.pwdAt) return false;
  return state.status === MemberStatus.ACTIVE;
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

/** Admin (BSSR): session must belong to an ACTIVE admin (a deactivated admin is locked out at once) */
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const member = req.session?.member;
  if (member?.memberType === MemberType.RESTAURANT && (await isActiveMember({ _id: String(member._id) } as AuthPayload))) {
    req.member = { _id: String(member._id), memberType: member.memberType, memberNick: member.memberNick };
    return next();
  }
  // AJAX calls get JSON, page navigations get the login redirect
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(HTTPCode.UNAUTHORIZED).json({ code: HTTPCode.UNAUTHORIZED, message: Message.NOT_AUTHENTICATED });
  }
  sendAdminAlert(res, Message.NOT_AUTHENTICATED, "/admin/login", HTTPCode.UNAUTHORIZED);
};

/**
 * CSRF protection for admin state-changing requests (synchronizer token).
 * The token lives in the session and is sent back as the X-CSRF-Token header
 * (set for all admin AJAX calls in header.ejs) or a _csrf query field (plain forms).
 */
export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  const expected = req.session?.csrfToken;
  const sent = (req.headers["x-csrf-token"] as string | undefined) || (req.query?._csrf as string | undefined) || req.body?._csrf;
  if (expected && typeof sent === "string" && safeEqual(sent, expected)) return next();
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(HTTPCode.FORBIDDEN).json({ code: HTTPCode.FORBIDDEN, message: Message.INVALID_CSRF });
  }
  sendAdminAlert(res, Message.INVALID_CSRF, "/admin/product/all", HTTPCode.FORBIDDEN);
};
