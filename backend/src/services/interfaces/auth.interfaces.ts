import { signInDTO, signUpDTO } from "../../dtos/auth.dtos";
import { AuthResponse, SignInResponse } from "../../interfaces/auth.interface";

export interface IAuthService {
  signUp(data: signUpDTO): Promise<AuthResponse>;
  signIn(data: signInDTO): Promise<SignInResponse>;
  verifyEmail(email: string, token: string): Promise<SignInResponse>;
  resendVerificationEmail(email: string): Promise<{ message: string }>;
  googleSign(token: string): Promise<SignInResponse>;
}
