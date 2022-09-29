import { Request, Response } from "express";
import { SendForgotPasswordEmailService } from "../services";

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService();

    const token = await sendForgotPasswordEmail.execute({ email });

    return response.status(200).json({ token });
  }
}

export default ForgotPasswordController;
