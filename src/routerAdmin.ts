import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/uploader";

/** Admin BSSR Routes **/
routerAdmin.get("/", restaurantController.goHome);
routerAdmin.get("/login", restaurantController.getLogin);
routerAdmin.post("/login", restaurantController.processLogin);
routerAdmin.get("/signup", restaurantController.getSignup);
routerAdmin.post(
  "/signup",
  makeUploader("members").single("memberImage"),
  restaurantController.processSignup
);
routerAdmin.get("/logout", restaurantController.logout);
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product Routes **/
routerAdmin.get(
  "/product/all",
  restaurantController.verifyRestaurant,
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  restaurantController.verifyRestaurant,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  restaurantController.verifyRestaurant,
  productController.updateChosenProduct
);
routerAdmin.post(
  "/product/:id/update",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenProductDetails
);

/** User Routes **/
routerAdmin.get(
  "/user/all",
  restaurantController.verifyRestaurant,
  restaurantController.getUsers
);
routerAdmin.post(
  "/user/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser
);
routerAdmin.post(
  "/user/:id/points",
  restaurantController.verifyRestaurant,
  restaurantController.updateMemberPoints
);

/** Order Routes **/
routerAdmin.get(
  "/order/all",
  restaurantController.verifyRestaurant,
  restaurantController.getAllOrders
);
routerAdmin.post(
  "/order/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenOrder
);

export default routerAdmin;
