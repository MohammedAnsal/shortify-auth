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
import { setCookie } from "../../utils/cookie";

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
      if (!parsedData) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Invalid credentials" });
      }

      const result = await this.authService.signIn(parsedData);

      setCookie(res, "refresh_token", String(result.refreshToken));

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

      const result = await this.authService.verifyEmail(email, token);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: result.message,
        email: result.email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
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

  async googleSign(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.body;

      const { email, accessToken, refreshToken } =
        await this.authService.googleSign(token);

      setCookie(res, "refresh_token", String(refreshToken));

      return res.status(HttpStatus.OK).json({
        email,
        accessToken,
        success: true,
      });
    } catch (error) {}
  }

  async logout(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "No token provided" });
      }

      res.clearCookie("refresh_token");

      return res
        .status(HttpStatus.OK)
        .json({ message: "Logged out successfully" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: "Email is required.",
        });
      }

      const result = await this.authService.resendVerificationEmail(email);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: result.message,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      console.error("Unexpected Error (resendVerificationEmail):", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: responseMessage.ERROR_MESSAGE,
      });
    }
  }
}

export const authController = Container.get(AuthController);
