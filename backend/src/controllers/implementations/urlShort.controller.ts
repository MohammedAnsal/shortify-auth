import Container, { Service } from "typedi";
import { IUrlController } from "../interfaces/urlShort.interfaces";
import { AuthRequest } from "../../interfaces/api";
import { Response } from "express";
import { urlService } from "../../services/implementations/urlShort.service";
import { IUrlService } from "../../services/interfaces/urlShort.interfaces";
import { HttpStatus, responseMessage } from "../../enums/http.status";
import { shortenUrlSchema } from "../../utils/validation/url.validation";

@Service()
class UrlController implements IUrlController {
  private urlService: IUrlService;

  constructor() {
    this.urlService = urlService;
  }

  async shortUrl(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { originalUrl } = req.body;
      // const parsed = shortenUrlSchema.parse(String(originalUrl));
      // console.log(parsed)
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
      }

      const result = await this.urlService.shortUrl({
        url: originalUrl,
        userId,
      });

      const baseUrl = "https://shortify-auth.vercel.app/";
      // const baseUrl = "http://localhost:5002/";
      const fullShortUrl = `${baseUrl}${result.shortUrl}`;

      return res.status(HttpStatus.OK).json({
        status: true,
        message: "Short URL created successfully",
        shortUrl: fullShortUrl,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: false, message: error.message || "Invalid input" });
    }
  }

  async redirect(req: AuthRequest, res: Response): Promise<any> {
    try {
      const { shortUrl } = req.params;
      // const userId = req.user?.id;

      // if (!userId) {
      //   return res
      //     .status(HttpStatus.UNAUTHORIZED)
      //     .json({ message: "User not authenticated" });
      // }

      const urlDoc = await this.urlService.getByShortUrl(shortUrl);

      if (!urlDoc) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: responseMessage.NOT_FOUND });
      }

      // if (urlDoc.visitCount >= 3) {
      //   return res
      //     .status(HttpStatus.FORBIDDEN)
      //     .json({ message: responseMessage.URL_LIMIT_REACHED });
      // }

      await this.urlService.incrementVisitCount(shortUrl);

      return res.redirect(urlDoc.originalUrl);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: responseMessage.ERROR_MESSAGE });
    }
  }

  async getUserUrls(req: AuthRequest, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const search = (req.query.search as string) || "";

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
      }

      const result = await this.urlService.getUserUrls(
        userId,
        page,
        limit,
        search
      );

      if (!result.status) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: false, message: result.message });
      }

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message || "Internal server error",
      });
    }
  }
}

export const urlController = Container.get(UrlController);
