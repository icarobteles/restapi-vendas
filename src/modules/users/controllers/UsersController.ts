import { Request, Response } from "express";
import { CreateUserService, ListUsersService } from "../services";
import { instanceToInstance } from "class-transformer";

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService();

    const users = await listUsers.execute();

    return response.status(200).json(instanceToInstance(users));
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUsers = new CreateUserService();

    const user = await createUsers.execute({ name, email, password });

    return response.status(201).json(instanceToInstance(user));
  }
}

export default UsersController;
