import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import uploader from "./libs/uploader";

/** SPA Member Routes **/
router.get("/member/restaurant", memberController.getRestaurant);
router.get("/member/top-users", memberController.getTopUsers);

router.post("/member/signup", memberController.signup);
router.post("/signup", memberController.signup);

router.post("/member/login", memberController.login);
router.post("/login", memberController.login);

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);

/** SPA Product Routes **/
router.get(
  "/product/all",
  memberController.retrieveAuth,
  productController.getProducts
);

router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct
);

/** SPA Order Routes **/
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);

router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);

export default router;
