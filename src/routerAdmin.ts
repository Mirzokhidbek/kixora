import express from "express";
import adminController from "./controllers/admin.controller";
import makeUploader from "./libs/uploader";
import { adminAuthLimiter } from "./libs/rateLimiter";
import { verifyAdmin } from "./middlewares/auth";

/** Admin panel (BSSR / EJS, session based) **/
const routerAdmin = express.Router();

/** Auth **/
routerAdmin.get("/", verifyAdmin, adminController.goHome);
routerAdmin.get("/login", adminController.getLogin);
routerAdmin.post("/login", adminAuthLimiter, adminController.processLogin);
routerAdmin.get("/signup", adminController.getSignup);
routerAdmin.post(
  "/signup",
  adminAuthLimiter,
  makeUploader("members").single("memberImage"),
  adminController.processSignup
);
routerAdmin.get("/logout", adminController.logout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/** Products **/
routerAdmin.get("/product/all", verifyAdmin, adminController.getAllProducts);
routerAdmin.post(
  "/product/create",
  verifyAdmin,
  makeUploader("products").array("productImages", 5),
  adminController.createNewProduct
);
routerAdmin.post("/product/:id", verifyAdmin, adminController.updateChosenProduct);
routerAdmin.post("/product/:id/update", verifyAdmin, adminController.updateChosenProduct);

/** Users **/
routerAdmin.get("/user/all", verifyAdmin, adminController.getUsers);
routerAdmin.post("/user/edit", verifyAdmin, adminController.updateChosenUser);
routerAdmin.post("/user/:id/points", verifyAdmin, adminController.updateMemberPoints);

/** Orders **/
routerAdmin.get("/order/all", verifyAdmin, adminController.getAllOrders);
routerAdmin.post("/order/edit", verifyAdmin, adminController.updateChosenOrder);

export default routerAdmin;
