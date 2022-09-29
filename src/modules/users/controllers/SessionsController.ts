import { Request, Response } from "express";
import { CreateSessionService } from "../services";
import { instanceToInstance } from "class-transformer";

class SessionsController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSessions = new CreateSessionService();

    const user = await createSessions.execute({ email, password });

    return response.status(200).json(instanceToInstance(user));
  }
}

export default SessionsController;
