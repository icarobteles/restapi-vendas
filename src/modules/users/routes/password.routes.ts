import { Router } from "express";
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import { celebrate, Joi, Segments } from "celebrate";
import ResetPasswordController from "../controllers/ResetPasswordController";

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  "/forgot",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

passwordRouter.post(
  "/reset",
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().min(6).required(),
      passwordConfirmation: Joi.string().required().valid(Joi.ref("password")),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
