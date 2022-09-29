import AppError from "@shared/errors";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../typeorm/repositories/UsersRepository";
import { UserTokensRepository } from "../typeorm/repositories/UserTokensRepository";

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<string | undefined> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("User does not exists", 404);
    }

    const userToken = await userTokensRepository.generate(user.id);

    return userToken?.token;
  }
}

export default SendForgotPasswordEmailService;
