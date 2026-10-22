import express from "express";
import adminController from "./controllers/admin.controller";
import makeUploader from "./libs/uploader";
import { adminAuthLimiter } from "./libs/rateLimiter";
import { verifyAdmin, verifyCsrf } from "./middlewares/auth";

/** Admin panel (BSSR / EJS, session based) **/
const routerAdmin = express.Router();

/** Every state-changing admin request needs a signed-in admin AND a valid CSRF token */
const adminWrite = [verifyAdmin, verifyCsrf];

/** Auth (no session yet, so no CSRF token; protected by rate limits) **/
routerAdmin.get("/", verifyAdmin, adminController.goHome);
routerAdmin.get("/login", adminController.getLogin);
routerAdmin.post("/login", adminAuthLimiter, adminController.processLogin);
routerAdmin.get("/login/2fa", adminController.getLoginTwoFactor);
routerAdmin.post("/login/2fa", adminAuthLimiter, adminController.processLoginTwoFactor);
routerAdmin.get("/signup", adminController.getSignup);
routerAdmin.post(
  "/signup",
  adminAuthLimiter,
  makeUploader("members").single("memberImage"),
  adminController.processSignup
);
routerAdmin.get("/logout", adminController.logout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/** Products (multipart forms send the token as ?_csrf=, checked before the upload is accepted) **/
routerAdmin.get("/product/all", verifyAdmin, adminController.getAllProducts);
routerAdmin.post(
  "/product/create",
  ...adminWrite,
  makeUploader("products").array("productImages", 5),
  adminController.createNewProduct
);
routerAdmin.post(
  "/product/:id/images",
  ...adminWrite,
  makeUploader("products").array("productImages", 5),
  adminController.replaceProductImages
);
routerAdmin.post("/product/:id", ...adminWrite, adminController.updateChosenProduct);
routerAdmin.post("/product/:id/update", ...adminWrite, adminController.updateChosenProduct);

/** Users **/
routerAdmin.get("/user/all", verifyAdmin, adminController.getUsers);
routerAdmin.post("/user/edit", ...adminWrite, adminController.updateChosenUser);
routerAdmin.post("/user/:id/points", ...adminWrite, adminController.updateMemberPoints);

/** Orders **/
routerAdmin.get("/order/all", verifyAdmin, adminController.getAllOrders);
routerAdmin.post("/order/edit", ...adminWrite, adminController.updateChosenOrder);

/** Review moderation **/
routerAdmin.get("/review/all", verifyAdmin, adminController.getReviews);
routerAdmin.post("/review/:id/status", ...adminWrite, adminController.updateReviewStatus);
routerAdmin.post("/review/:id/reply", ...adminWrite, adminController.replyToReview);
routerAdmin.post("/review/:id/delete", ...adminWrite, adminController.deleteReview);

/** Inbox **/
routerAdmin.get("/inbox", verifyAdmin, adminController.getInbox);
routerAdmin.post("/inbox/:id/status", ...adminWrite, adminController.updateMessageStatus);
routerAdmin.get("/inbox/subscribers.csv", verifyAdmin, adminController.exportSubscribers);

/** Security: two-factor login and admin accounts **/
routerAdmin.get("/security", verifyAdmin, adminController.getSecurity);
routerAdmin.post("/security/2fa/enable", ...adminWrite, adminController.enableTotp);
routerAdmin.post("/security/2fa/disable", ...adminWrite, adminController.disableTotp);
routerAdmin.post("/security/admins", ...adminWrite, adminController.createAdmin);
routerAdmin.post("/security/admins/:id/status", ...adminWrite, adminController.setAdminStatus);

export default routerAdmin;
