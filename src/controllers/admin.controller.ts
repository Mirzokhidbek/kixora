import { Request, Response } from "express";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import MemberService from "../services/Member.service";
import OrderService from "../services/Order.service";
import ProductService from "../services/Product.service";
import ReviewService from "../services/Review.service";
import SupportService from "../services/Support.service";
import AdminSecurityService from "../services/AdminSecurity.service";
import crypto from "crypto";
import { MemberStatus } from "../libs/enums/member.enum";
import { sendAdminAlert } from "../libs/adminResponse";
import { storedPath } from "../libs/uploader";
import {
  adminListSchema,
  adminLoginSchema,
  adminPointsSchema,
  adminInboxSchema,
  adminStatusSchema,
  totpCodeSchema,
  adminMessageStatusSchema,
  adminReviewListSchema,
  adminReviewReplySchema,
  adminReviewStatusSchema,
  adminSignupSchema,
  adminUserUpdateSchema,
  orderUpdateSchema,
  parse,
  productCreateSchema,
  productUpdateSchema,
} from "../libs/validation";
import { Member, SessionMember } from "../libs/types/member";
import { logger } from "../libs/logger";

const memberService = new MemberService();
const orderService = new OrderService();
const productService = new ProductService();
const reviewService = new ReviewService();
const supportService = new SupportService();
const adminSecurity = new AdminSecurityService();

const ADMIN_PAGE_SIZE = 25;

const errorMessage = (err: unknown) => {
  if (err instanceof Errors) return err.message;
  logger.error("Admin request failed", { err });
  return Message.SOMETHING_WENT_WRONG;
};

const pagination = (page: number, total: number, basePath: string) => ({
  page,
  totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
  total,
  basePath,
});

/**
 * Starts a fresh session on login (prevents session fixation).
 * Only a small plain-JSON identity is stored: it keeps sessions light and avoids
 * BSON version clashes between mongoose ObjectIds and the session store driver.
 */
function establishSession(req: Request, member: Member): Promise<void> {
  const sessionMember: SessionMember = {
    _id: String(member._id),
    memberType: member.memberType,
    memberNick: member.memberNick,
    memberPhone: member.memberPhone,
    memberImage: member.memberImage,
  };
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.member = sessionMember;
      req.session.csrfToken = crypto.randomBytes(24).toString("hex");
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
}

/** Password was right but a 2FA code is still required: no admin rights in this session yet */
function startTwoFactorStep(req: Request, adminId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.pending2faAdminId = adminId;
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
}

const adminController = {
  goHome: async (_req: Request, res: Response) => {
    const [orderMetrics, productMetrics, userCount] = await Promise.all([
      orderService.getAdminDashboardMetrics(),
      productService.getProductDashboardMetrics(),
      memberService.countUsers(),
    ]);
    res.render("home", { orderMetrics, productMetrics, userCount });
  },

  getLogin: (_req: Request, res: Response) => res.render("login"),

  getSignup: (_req: Request, res: Response) => res.render("signup"),

  processSignup: async (req: Request, res: Response) => {
    try {
      const input = parse(adminSignupSchema, req.body);
      const memberImage = req.file ? storedPath(req.file) : undefined;
      const member = await memberService.processSignup({ ...input, memberImage });
      await establishSession(req, member);
      res.redirect("/admin/product/all");
    } catch (err) {
      sendAdminAlert(res, errorMessage(err), "/admin/signup");
    }
  },

  processLogin: async (req: Request, res: Response) => {
    try {
      const member = await memberService.processLogin(parse(adminLoginSchema, req.body));
      if (await adminSecurity.isTotpEnabled(String(member._id))) {
        await startTwoFactorStep(req, String(member._id));
        return res.redirect("/admin/login/2fa");
      }
      await establishSession(req, member);
      res.redirect("/admin/product/all");
    } catch (err) {
      sendAdminAlert(res, errorMessage(err), "/admin/login");
    }
  },

  getLoginTwoFactor: (req: Request, res: Response) => {
    if (!req.session?.pending2faAdminId) return res.redirect("/admin/login");
    res.render("login-2fa");
  },

  processLoginTwoFactor: async (req: Request, res: Response) => {
    const adminId = req.session?.pending2faAdminId;
    if (!adminId) return res.redirect("/admin/login");
    try {
      const { code } = parse(totpCodeSchema, req.body);
      if (!(await adminSecurity.verifyTotp(adminId, code))) throw new Errors(HTTPCode.UNAUTHORIZED, Message.INVALID_2FA_CODE);
      const member = await memberService.getAdminForSession(adminId);
      await establishSession(req, member);
      res.redirect("/admin/product/all");
    } catch (err) {
      sendAdminAlert(res, errorMessage(err), "/admin/login/2fa");
    }
  },

  logout: (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/admin");
    });
  },

  checkAuthSession: (req: Request, res: Response) => {
    const member = req.session?.member;
    res.json({ authenticated: Boolean(member), memberNick: member?.memberNick ?? null });
  },

  // ---------- Products ----------
  getAllProducts: async (req: Request, res: Response) => {
    const { page } = parse(adminListSchema, req.query);
    const { products, total } = await productService.getAllProducts(page, ADMIN_PAGE_SIZE);
    res.render("products", { products, pagination: pagination(page, total, "/admin/product/all") });
  },

  createNewProduct: async (req: Request, res: Response) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_FILE);
      const input = parse(productCreateSchema, req.body);
      await productService.createNewProduct({
        ...input,
        productImages: files.map(storedPath),
      });
      sendAdminAlert(res, "Successfully created!", "/admin/product/all");
    } catch (err) {
      sendAdminAlert(res, errorMessage(err), "/admin/product/all");
    }
  },

  /** AJAX: status change and quick-edit modal share one validated update */
  updateChosenProduct: async (req: Request, res: Response) => {
    const input = parse(productUpdateSchema, req.body);
    const data = await productService.updateChosenProduct(String(req.params.id), input);
    res.status(HTTPCode.OK).json({ data });
  },

  /** AJAX: replace product images (multipart "productImages", 1–5 files) */
  replaceProductImages: async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_FILE);
    const data = await productService.replaceProductImages(
      String(req.params.id),
      files.map(storedPath)
    );
    res.status(HTTPCode.OK).json({ data });
  },

  // ---------- Users ----------
  getUsers: async (req: Request, res: Response) => {
    const { page } = parse(adminListSchema, req.query);
    const { users, total } = await memberService.getUsers(page, ADMIN_PAGE_SIZE);
    res.render("users", { users, pagination: pagination(page, total, "/admin/user/all") });
  },

  updateChosenUser: async (req: Request, res: Response) => {
    const data = await memberService.updateChosenUser(parse(adminUserUpdateSchema, req.body));
    res.status(HTTPCode.OK).json({ data });
  },

  updateMemberPoints: async (req: Request, res: Response) => {
    const { points } = parse(adminPointsSchema, req.body);
    const data = await memberService.updateMemberPointsByAdmin(String(req.params.id), points);
    res.status(HTTPCode.OK).json({ data });
  },

  // ---------- Orders ----------
  getAllOrders: async (req: Request, res: Response) => {
    const { page } = parse(adminListSchema, req.query);
    const { orders, total } = await orderService.getAllOrdersByAdmin(page, ADMIN_PAGE_SIZE);
    res.render("orders", { orders, pagination: pagination(page, total, "/admin/order/all") });
  },

  updateChosenOrder: async (req: Request, res: Response) => {
    const data = await orderService.updateOrderByAdmin(parse(orderUpdateSchema, req.body));
    res.status(HTTPCode.OK).json({ data });
  },

  // ---------- Security: 2FA and admin accounts ----------
  getSecurity: async (req: Request, res: Response) => {
    const [admins, totpEnabled] = await Promise.all([
      adminSecurity.listAdmins(),
      adminSecurity.isTotpEnabled(req.member!._id),
    ]);
    let setup: { secret: string; qrDataUrl: string } | null = null;
    if (!totpEnabled) {
      setup = await adminSecurity.startTotpSetup(req.member!.memberNick);
      req.session.pendingTotpSecret = setup.secret;
    }
    res.render("security", { admins, totpEnabled, setup, currentAdminId: req.member!._id });
  },

  enableTotp: async (req: Request, res: Response) => {
    const { code } = parse(totpCodeSchema, req.body);
    const secret = req.session.pendingTotpSecret;
    if (!secret) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_2FA_CODE);
    await adminSecurity.confirmTotpSetup(req.member!._id, secret, code);
    delete (req.session as any).pendingTotpSecret;
    res.status(HTTPCode.OK).json({ enabled: true });
  },

  disableTotp: async (req: Request, res: Response) => {
    const { code } = parse(totpCodeSchema, req.body);
    await adminSecurity.disableTotp(req.member!._id, code);
    res.status(HTTPCode.OK).json({ enabled: false });
  },

  createAdmin: async (req: Request, res: Response) => {
    const input = parse(adminSignupSchema, req.body);
    res.status(HTTPCode.CREATED).json({ data: await adminSecurity.createAdmin(input) });
  },

  setAdminStatus: async (req: Request, res: Response) => {
    const { memberStatus } = parse(adminStatusSchema, req.body);
    await adminSecurity.setAdminStatus(req.member!._id, String(req.params.id), memberStatus as MemberStatus.ACTIVE | MemberStatus.BLOCK);
    res.status(HTTPCode.OK).json({ updated: true });
  },

  // ---------- Inbox (contact messages & newsletter) ----------
  getInbox: async (req: Request, res: Response) => {
    const { page, status } = parse(adminInboxSchema, req.query);
    const { messages, total, newCount, subscriberCount } = await supportService.getMessages(page, ADMIN_PAGE_SIZE, status);
    const basePath = status ? `/admin/inbox?status=${status}&` : "/admin/inbox?";
    res.render("inbox", {
      messages,
      newCount,
      subscriberCount,
      activeStatus: status || "ALL",
      pagination: { ...pagination(page, total, basePath), queryJoined: true },
    });
  },

  updateMessageStatus: async (req: Request, res: Response) => {
    const { status } = parse(adminMessageStatusSchema, req.body);
    res.status(HTTPCode.OK).json({ data: await supportService.setMessageStatus(String(req.params.id), status) });
  },

  exportSubscribers: async (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="kixora-subscribers.csv"');
    res.send(await supportService.subscribersCsv());
  },

  // ---------- Review moderation ----------
  getReviews: async (req: Request, res: Response) => {
    const { page, status } = parse(adminReviewListSchema, req.query);
    const { reviews, total, statusCounts } = await reviewService.getReviewsByAdmin(page, ADMIN_PAGE_SIZE, status);
    const basePath = status ? `/admin/review/all?status=${status}&` : "/admin/review/all?";
    res.render("reviews", {
      reviews,
      statusCounts,
      activeStatus: status || "ALL",
      pagination: { ...pagination(page, total, basePath), queryJoined: true },
    });
  },

  updateReviewStatus: async (req: Request, res: Response) => {
    const { reviewStatus } = parse(adminReviewStatusSchema, req.body);
    const data = await reviewService.setReviewStatus(String(req.params.id), reviewStatus);
    res.status(HTTPCode.OK).json({ data });
  },

  replyToReview: async (req: Request, res: Response) => {
    const { adminReply } = parse(adminReviewReplySchema, req.body);
    const data = await reviewService.replyToReview(String(req.params.id), adminReply);
    res.status(HTTPCode.OK).json({ data });
  },

  deleteReview: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await reviewService.deleteReviewByAdmin(String(req.params.id)));
  },
};

export default adminController;
