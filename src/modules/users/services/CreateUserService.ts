import AppError from "@shared/errors";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UsersRepository } from "../typeorm/repositories/UsersRepository";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);

    const emailExists = await usersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError("There is already one user with this email");
    }

    const hashedPassword = await hash(password, 12);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default CreateUserService;
