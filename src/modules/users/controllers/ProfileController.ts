import { Request, Response } from "express";
import { ShowProfileService, UpdateProfileService } from "../services";
import { instanceToInstance } from "class-transformer";

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProfile = new ShowProfileService();
    const user_id = request.user.id;

    const user = await showProfile.execute({ user_id });

    return response.status(200).json(instanceToInstance(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, newPassword, currentPassword } = request.body;
    const user_id = request.user.id;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      newPassword,
      currentPassword,
    });

    return response.status(200).json(instanceToInstance(user));
  }
}

export default ProfileController;
