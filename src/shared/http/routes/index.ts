import { customersRouter } from "@modules/customers/routes";
import { ordersRouter } from "@modules/orders/routes";
import { productsRouter } from "@modules/products/routes";
import {
  usersRouter,
  sessionsRouter,
  passwordRouter,
  profileRouter,
} from "@modules/users/routes";
import { Router } from "express";

const routes = Router();

routes.use("/products", productsRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/password", passwordRouter);
routes.use("/profile", profileRouter);
routes.use("/customers", customersRouter);
routes.use("/orders", ordersRouter);

export default routes;
