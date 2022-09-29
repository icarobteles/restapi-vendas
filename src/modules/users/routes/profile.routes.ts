import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import isAuthenticated from "@shared/http/middlewares/isAuthenticated";
import ProfileController from "../controllers/ProfileController";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get("/", profileController.show);

profileRouter.patch(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      newPassword: Joi.string().min(6).optional(),
      newPasswordConfirmation: Joi.string()
        .valid(Joi.ref("newPassword"))
        .when("newPassword", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
      currentPassword: Joi.string().min(6),
    },
  }),
  profileController.update,
);

export default profileRouter;
