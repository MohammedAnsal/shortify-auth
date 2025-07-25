import Container, { Service } from "typedi";
import { IAuthService } from "../interfaces/auth.interfaces";
import { signInDTO, signUpDTO } from "../../dtos/auth.dtos";
import { AuthResponse, SignInResponse } from "../../interfaces/auth.interface";
import { IUserRepository } from "../../repositories/interfaces/user.Irepository";
import { userRepository } from "../../repositories/implementations/user.repository";
import { AppError } from "../../utils/custom.error";
import { HttpStatus, responseMessage } from "../../enums/http.status";
import { hashPassword, RandomPassword } from "../../utils/password.hash";
import { IUser } from "../../models/user.model";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreashToken,
  verifyEmailToken,
} from "../../utils/jwt.utils";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../utils/email.utils";
import { OAuth2Client } from "google-auth-library";

const clinet = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Service()
class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  constructor() {
    this.userRepository = userRepository;
  }

  async signUp(data: signUpDTO): Promise<AuthResponse> {
    try {
      const { fullName, email, password } = data;

      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        if (existingUser.is_verified) {
          throw new AppError(
            HttpStatus.CONFLICT,
            responseMessage.USER_ALREADY_EXISTS
          );
        } else {
          throw new AppError(
            HttpStatus.BAD_REQUEST,
            "User already registered but not verified. Please verify your email."
          );
        }
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.userRepository.create({
        fullName,
        email,
        password: hashedPassword,
        is_verified: false,
      } as IUser);

      const verificationToken = generateEmailVerificationToken(email);

      await sendVerificationEmail({ email, token: verificationToken });

      return {
        message: "User created successfully. Please verify your email.",
        status: true,
        email: newUser.email,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("SignUp Error:", error);

      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        responseMessage.ERROR_MESSAGE
      );
    }
  }

  async signIn(data: signInDTO): Promise<SignInResponse> {
    try {
      const { email, password } = data;

      const existingUser = await this.userRepository.findByEmail(email);

      if (!existingUser)
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid Credentials");

      if (!existingUser.is_verified)
        throw new AppError(
          HttpStatus.UNAUTHORIZED,
          "Email not verified. Please verify your email."
        );

      const comparePassword = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!comparePassword)
        throw new AppError(HttpStatus.BAD_REQUEST, "Incorrect password");

      const accessToken = generateAccessToken({ id: existingUser._id });

      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Sign in successfully completed",
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("SignIn Error:", error);

      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        responseMessage.ERROR_MESSAGE
      );
    }
  }

  async verifyEmail(email: string, token: string): Promise<SignInResponse> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (!existingUser) {
        throw new AppError(
          HttpStatus.NOT_FOUND,
          "User not found. Please register again."
        );
      }

      if (existingUser && existingUser.is_verified)
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Already verified email, please login"
        );

      const decodedEmail = verifyEmailToken(token);

      if (decodedEmail !== email)
        throw new AppError(
          HttpStatus.UNAUTHORIZED,
          "Verification link is invalid or expired. Please request a new one."
        );

      await this.userRepository.verifyUser(email, true);

      const accessToken = generateAccessToken({ id: existingUser._id });

      const refreshToken = generateRefreashToken({ id: existingUser._id });

      return {
        status: true,
        message: "Email verified successfully",
        email: existingUser.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Verify Email Error:", error);

      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        responseMessage.ERROR_MESSAGE
      );
    }
  }

  async googleSign(token: string): Promise<SignInResponse> {
    try {
      let user;

      const ticket = clinet.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = (await ticket).getPayload();

      if (!payload) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid token");
      }

      const { name, email } = payload;

      if (!email) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Google account does not have an email"
        );
      }

      user = await this.userRepository.findByEmail(email);

      if (user && user.is_verified === false) {
        throw new AppError(
          HttpStatus.FORBIDDEN,
          "User account is not verified"
        );
      }

      if (!user) {
        const password = await RandomPassword();

        user = await this.userRepository.create({
          fullName: name,
          email,
          password,
          is_verified: true,
        } as IUser);
      }

      const accessToken = generateAccessToken({
        id: user._id,
      });

      const refreshToken = generateRefreashToken({
        id: user._id,
      });

      return {
        status: true,
        message: "Sign in successfully completed",
        email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Google SignIn Error:", error);

      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        responseMessage.ERROR_MESSAGE
      );
    }
  }
}

export const authService = Container.get(AuthService);
