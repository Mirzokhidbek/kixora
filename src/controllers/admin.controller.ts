import { Request, Response } from "express";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import MemberService from "../services/Member.service";
import OrderService from "../services/Order.service";
import ProductService from "../services/Product.service";
import ReviewService from "../services/Review.service";
import { sendAdminAlert } from "../libs/adminResponse";
import {
  adminListSchema,
  adminLoginSchema,
  adminPointsSchema,
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

const memberService = new MemberService();
const orderService = new OrderService();
const productService = new ProductService();
const reviewService = new ReviewService();

const ADMIN_PAGE_SIZE = 25;

const errorMessage = (err: unknown) => {
  if (err instanceof Errors) return err.message;
  console.error("Admin error:", err);
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
      const memberImage = req.file ? req.file.path.replace(/\\/g, "/") : undefined;
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
      await establishSession(req, member);
      res.redirect("/admin/product/all");
    } catch (err) {
      sendAdminAlert(res, errorMessage(err), "/admin/login");
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
        productImages: files.map((f) => f.path.replace(/\\/g, "/")),
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
      files.map((f) => f.path.replace(/\\/g, "/"))
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
