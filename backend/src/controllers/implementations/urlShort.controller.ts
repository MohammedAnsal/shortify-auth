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
      const parsed = shortenUrlSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "User not authenticated" });
      }

      const result = await this.urlService.shortUrl({
        url: parsed.originalUrl,
        userId,
      });

      console.log(result)

      return res.status(HttpStatus.OK).json({
        status: true,
        message: "Short URL created successfully",
        shortUrl: result.shortUrl,
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

      if (urlDoc.visitCount >= 3) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: responseMessage.URL_LIMIT_REACHED });
      }

      await this.urlService.incrementVisitCount(shortUrl);

      return res.redirect(urlDoc.originalUrl);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: responseMessage.ERROR_MESSAGE });
    }
  }
}

export const urlController = Container.get(UrlController);
