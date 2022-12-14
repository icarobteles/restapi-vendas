import AppError from "@shared/errors";
import { hash } from "bcryptjs";
import { isAfter, addHours } from "date-fns";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../typeorm/repositories/UsersRepository";
import { UserTokensRepository } from "../typeorm/repositories/UserTokensRepository";

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError("User Token does not exists", 404);
    }

    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError("User does not exists", 404);
    }

    // VERIFICA SE O TEMPO DE DURAÇÃO (2 HORAS) DO TOKEN JÁ EXPIROU
    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired", 498);
    }

    user.password = await hash(password, 12);
    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
