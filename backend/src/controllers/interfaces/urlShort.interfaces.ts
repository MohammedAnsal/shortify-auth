import { Request, Response } from "express";
import { AuthRequest } from "../../interfaces/api";

export interface IUrlController {
  shortUrl(req: AuthRequest, res: Response): Promise<Response>;
  redirect(req: AuthRequest, res: Response): Promise<any>;
}
