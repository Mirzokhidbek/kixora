import express from "express";
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import engagementController from "./controllers/engagement.controller";
import paymentController from "./controllers/payment.controller";
import supportController from "./controllers/support.controller";
import makeUploader from "./libs/uploader";
import { aiSearchLimiter, authLimiter, contactLimiter, engagementLimiter, orderLimiter } from "./libs/rateLimiter";
import { retrieveAuth, verifyAuth } from "./middlewares/auth";

/** SPA REST API (customers) **/
const router = express.Router();

/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
router.get("/member/top-users", memberController.getTopUsers);
router.post("/member/signup", authLimiter, memberController.signup);
router.post("/member/login", authLimiter, memberController.login);
router.post("/member/google-login", authLimiter, memberController.googleLogin);
router.post("/member/logout", memberController.logout);
router.post("/member/password/forgot", contactLimiter, memberController.forgotPassword);
router.post("/member/password/reset", authLimiter, memberController.resetPassword);
router.post("/member/email/verify", authLimiter, memberController.verifyEmail);
router.post("/member/email/resend", verifyAuth, contactLimiter, memberController.resendVerification);
router.get("/member/detail", verifyAuth, memberController.getMemberDetail);
router.post(
  "/member/update",
  verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateMember
);

/** Product **/
router.get("/product/all", productController.getProducts);
router.post("/product/ai-search", aiSearchLimiter, productController.aiSearchProducts);
// static paths must come before "/product/:id"
router.get("/product/batch", productController.getProductsBatch);
router.get("/product/liked", verifyAuth, engagementController.getLikedProducts);
router.post("/product/liked/sync", verifyAuth, engagementLimiter, engagementController.syncLikes);
router.get("/product/:id", retrieveAuth, productController.getProduct);

/** Likes & Reviews **/
router.post("/product/:id/like", verifyAuth, engagementLimiter, engagementController.likeProduct);
router.delete("/product/:id/like", verifyAuth, engagementLimiter, engagementController.unlikeProduct);
router.get("/product/:id/reviews", engagementController.getProductReviews);
router.get("/product/:id/reviews/me", verifyAuth, engagementController.getMyReview);
router.put("/product/:id/reviews/me", verifyAuth, engagementLimiter, engagementController.saveMyReview);
router.delete("/product/:id/reviews/me", verifyAuth, engagementLimiter, engagementController.deleteMyReview);

/** Order **/
router.post("/order/create", verifyAuth, orderLimiter, orderController.createOrder);
router.get("/order/all", verifyAuth, orderController.getMyOrders);
router.post("/order/update", verifyAuth, orderController.updateOrder);

/** Payment **/
router.get("/payment/config", paymentController.getConfig);
router.post("/payment/test/pay", verifyAuth, orderLimiter, paymentController.payWithTestProvider);

/** Support & newsletter **/
router.post("/support/message", contactLimiter, retrieveAuth, supportController.createMessage);
router.post("/newsletter/subscribe", contactLimiter, supportController.subscribe);
router.post("/newsletter/unsubscribe", contactLimiter, supportController.unsubscribe);

export default router;
