import { CookieOptions, Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import { storedPath } from "../libs/uploader";
import MemberService from "../services/Member.service";
import AuthService from "../services/Auth.service";
import { AUTH_TIMER, env } from "../libs/config";
import { Member } from "../libs/types/member";
import AccountService from "../services/Account.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema,
  loginSchema,
  memberUpdateSchema,
  parse,
  signupSchema,
} from "../libs/validation";

const memberService = new MemberService();
const authService = new AuthService();
const accountService = new AccountService();

const authCookieOptions: CookieOptions = {
  httpOnly: true, // not readable by JavaScript (XSS protection)
  sameSite: env.isProduction ? "none" : "lax",
  secure: env.isProduction, // HTTPS only in production
};

/** Issues the JWT as an httpOnly cookie and returns the member */
async function sendAuthResponse(res: Response, member: Member, status: HTTPCode) {
  const token = await authService.createToken(member);
  res.cookie("accessToken", token, { ...authCookieOptions, maxAge: AUTH_TIMER * 3600 * 1000 });
  // The token is only in the httpOnly cookie (not in the body), so page scripts can
  // never read it. The SPA reaches the API same-site via the /api proxy (docs/AUDIT.md S-9).
  res.status(status).json({ member });
}

const memberController = {
  /** SPA: Store public profile **/
  getRestaurant: async (_req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await memberService.getRestaurant());
  },

  /** SPA: Top 4 users by loyalty points **/
  getTopUsers: async (_req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await memberService.getTopUsers());
  },

  signup: async (req: Request, res: Response) => {
    const member = await memberService.signup(parse(signupSchema, req.body));
    await sendAuthResponse(res, member, HTTPCode.CREATED);
  },

  forgotPassword: async (req: Request, res: Response) => {
    const { memberEmail } = parse(forgotPasswordSchema, req.body);
    res.status(HTTPCode.OK).json(await accountService.requestPasswordReset(memberEmail));
  },

  resetPassword: async (req: Request, res: Response) => {
    const { token, memberPassword } = parse(resetPasswordSchema, req.body);
    const result = await accountService.resetPassword(token, memberPassword);
    res.clearCookie("accessToken", authCookieOptions); // sign in again with the new password
    res.status(HTTPCode.OK).json(result);
  },



  login: async (req: Request, res: Response) => {
    const member = await memberService.login(parse(loginSchema, req.body));
    await sendAuthResponse(res, member, HTTPCode.OK);
  },

  /** SPA: Google sign-in. Only a signature-verified ID token is accepted. **/
  googleLogin: async (req: Request, res: Response) => {
    const { credential } = parse(googleLoginSchema, req.body);
    const googleData = await authService.verifyGoogleCredential(credential);
    const member = await memberService.googleLogin(googleData);
    await sendAuthResponse(res, member, HTTPCode.OK);
  },

  logout: (_req: Request, res: Response) => {
    res.clearCookie("accessToken", authCookieOptions);
    res.status(HTTPCode.OK).json({ logout: true });
  },

  getMemberDetail: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await memberService.getMemberDetail(req.member!));
  },

  updateMember: async (req: Request, res: Response) => {
    const input = parse(memberUpdateSchema, req.body);
    const update = req.file ? { ...input, memberImage: storedPath(req.file) } : input;
    res.status(HTTPCode.OK).json(await memberService.updateMember(req.member!, update));
  },
};

export default memberController;
