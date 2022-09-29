import AppError from "@shared/errors";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { UpdateUserAvatarService } from "../services";
import uploadConfig from "@config/upload";
import { instanceToInstance } from "class-transformer";

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = new UpdateUserAvatarService();

    const userId = request.user.id;

    if (!request.file) {
      throw new AppError("File is required", 422);
    }

    const avatarFilename = request.file.filename;

    const [type, extension] = request.file.mimetype.split("/");

    const destroy = async () => {
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        avatarFilename,
      );
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    };

    if (type !== "image") {
      await destroy();
      throw new AppError("Must be an image", 422);
    }

    if (extension !== "png" && extension !== "jpg") {
      await destroy();
      throw new AppError("The image must be in png or jpg format", 422);
    }

    const user = await updateAvatar.execute({ userId, avatarFilename });

    return response.status(200).json(instanceToInstance(user));
  }
}

export default UserAvatarController;
