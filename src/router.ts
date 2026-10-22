import express from "express";
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import makeUploader from "./libs/uploader";
import { aiSearchLimiter, authLimiter, orderLimiter } from "./libs/rateLimiter";
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
router.get("/product/:id", retrieveAuth, productController.getProduct);

/** Order **/
router.post("/order/create", verifyAuth, orderLimiter, orderController.createOrder);
router.get("/order/all", verifyAuth, orderController.getMyOrders);
router.post("/order/update", verifyAuth, orderController.updateOrder);

export default router;
