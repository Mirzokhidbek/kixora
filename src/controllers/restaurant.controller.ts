import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import MemberService from "../models/Member.service";
import OrderService from "../models/Order.service";
import ProductService from "../models/Product.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

const memberService = new MemberService();
const orderService = new OrderService();
const productService = new ProductService();
const restaurantController: T = {};

restaurantController.goHome = async (req: Request, res: Response) => {
  try {
    const orderMetrics = await orderService.getAdminDashboardMetrics();
    const productMetrics = await productService.getProductDashboardMetrics();
    const allUsers = await memberService.getUsers();

    res.render("home", {
      orderMetrics,
      productMetrics,
      userCount: allUsers.length,
    });
  } catch (err) {
    console.log("Error, goHome:", err);
    res.render("home", {
      orderMetrics: {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        processOrders: 0,
        finishOrders: 0,
        monthlySales: { months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], revenues: [0, 0, 0, 0, 0, 0] },
        statusBreakdown: { pause: 0, process: 0, finish: 0 },
      },
      productMetrics: {
        totalProducts: 0,
        activeProducts: 0,
        lowStockCount: 0,
        categoryBreakdown: {},
      },
      userCount: 0,
    });
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;
    const newMember: MemberInput = req.body;
    if (file) newMember.memberImage = file.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.RESTAURANT;

    const result = await memberService.processSignup(newMember);
    req.session.member = JSON.parse(JSON.stringify(result));
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup'); </script>`
    );
  }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = JSON.parse(JSON.stringify(result));
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login'); </script>`
    );
  }
};

restaurantController.logout = async (req: Request, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, getUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.updateChosenUser = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);
    res.status(HTTPCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenUser:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.checkAuthSession = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("checkAuthSession, req.session.member:", req.session?.member);
    if (req.session?.member) {
      res.send(`Hi ${req.session.member.memberNick}`);
    } else {
      res.send(Message.NOT_AUTHENTICATED);
    }
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Admin BSSR: Get All Footwear Orders **/
restaurantController.getAllOrders = async (req: Request, res: Response) => {
  try {
    console.log("getAllOrders (Admin)");
    const result = await orderService.getAllOrdersByAdmin();
    res.render("orders", { orders: result });
  } catch (err) {
    console.log("Error, getAllOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Admin BSSR: 1-Click Update Order Status **/
restaurantController.updateChosenOrder = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChosenOrder (Admin):", req.body);
    const result = await orderService.updateOrderByAdmin(req.body);
    res.status(HTTPCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Admin BSSR: Update Product Details Modal **/
restaurantController.updateChosenProductDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    console.log("updateChosenProductDetails (Admin):", id, req.body);
    const result = await productService.updateChosenProduct(id, req.body);
    res.status(HTTPCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProductDetails:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** Admin BSSR: Update Customer Loyalty Points **/
restaurantController.updateMemberPoints = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const points = Number(req.body.points || 0);
    console.log("updateMemberPoints (Admin):", id, points);
    const result = await memberService.updateMemberPointsByAdmin(id, points);
    res.status(HTTPCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateMemberPoints:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.verifyRestaurant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = `<script> alert('${Message.NOT_AUTHENTICATED}'); window.location.replace('/admin/login'); </script>`;
    res.send(message);
  }
};

export default restaurantController;
