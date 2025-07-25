import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<any>;
  signIn(req: Request, res: Response): Promise<any>;
  verifyEmail(req: Request, res: Response): Promise<any>;
  googleSign(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
}
