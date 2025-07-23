import { Request, Response } from "express";
import Container, { Service } from "typedi";
import { IAuthController } from "../interfaces/auth.interfaces";
import {
  signInSchema,
  signUpSchema,
} from "../../utils/validation/user.validation";
import { IAuthService } from "../../services/interfaces/auth.interfaces";
import { HttpStatus, responseMessage } from "../../enums/http.status";
import { AppError } from "../../utils/custom.error";
import { ZodError } from "zod";
import { authService } from "../../services/implementations/auth.service";

@Service()
class AuthController implements IAuthController {
  private authService: IAuthService;
  constructor() {
    this.authService = authService;
  }

  async signUp(req: Request, res: Response): Promise<any> {
    try {
      const parsedData = signUpSchema.parse(req.body);

      const result = await this.authService.signUp(parsedData);

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error: any) {
      if (error.name === ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: error.errors[0].message,
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async signIn(req: Request, res: Response): Promise<any> {
    try {
      const parsedData = signInSchema.parse(req.body);

      const result = await this.authService.signIn(parsedData);

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: error.errors[0].message,
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (signUp):", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<any> {
    try {
      const email = req.query.email as string;
      const token = req.query.token as string;

      if (!email || !token) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: "Email and token are required for verification.",
        });
      }

      await this.authService.verifyEmail(email, token);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: (error as any).errors[0].message,
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (verifyEmail):", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<any> {
    try {
    } catch (error) {}
  }
}

export const authController = Container.get(AuthController);
