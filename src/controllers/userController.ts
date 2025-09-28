// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { registerUserSchema, loginUserSchema } from "../DTOs/userDTO";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      // sekarang registerUser sudah return { token, user }
      const { token, user } = await this.userService.registerUser(
        validatedData
      );

      res.status(201).json({
        status: "success",
        message: "User registered & logged in successfully",
        data: { token, user },
      });
    } catch (error: any) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      const { token, user } = await this.userService.loginUser(validatedData);

      res.status(200).json({
        status: "success",
        message: "User login successfully",
        data: { token, user },
      });
    } catch (error: any) {
      next(error);
    }
  };

  detail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const userDetail = await this.userService.getUserById(userId);

      res.status(200).json({
        status: "success",
        message: "User detail retrieved successfully",
        data: userDetail,
      });
    } catch (error: any) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.userService.deleteUser(userId);

      res
        .status(200)
        .json({ status: "success", message: "User deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  };
}
