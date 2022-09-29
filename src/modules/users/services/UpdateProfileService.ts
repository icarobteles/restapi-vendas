import AppError from "@shared/errors";
import { compare, hash } from "bcryptjs";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UsersRepository } from "../typeorm/repositories/UsersRepository";

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  newPassword?: string;
  currentPassword?: string;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    newPassword,
    currentPassword,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const emailExists = await usersRepository.findByEmail(email);
    if (emailExists && email !== user.email) {
      throw new AppError("Email already exists");
    }

    if (newPassword && !currentPassword) {
      throw new AppError("currentPassword is required", 422);
    }

    if (newPassword && currentPassword) {
      const checkPassword = await compare(currentPassword, user.password);
      if (!checkPassword) {
        throw new AppError("currentPassword does not match", 403);
      }

      user.password = await hash(newPassword, 12);
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
