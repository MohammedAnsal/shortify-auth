import Container, { Service } from "typedi";
import shortid from "shortid";
import { IUrlService } from "../interfaces/urlShort.interfaces";
import { UrlResponse } from "../../interfaces/urlShort.interface";
import { RequestUrl } from "../../dtos/urlShort.dtos";
import { IUrlRepository } from "../../repositories/interfaces/urlShort.Irepository";
import { urlRepository } from "../../repositories/implementations/urlShort.repository";
import { responseMessage } from "../../enums/http.status";

@Service()
class UrlService implements IUrlService {
  private urlRepository: IUrlRepository;
  constructor() {
    this.urlRepository = urlRepository;
  }

  async shortUrl(data: RequestUrl): Promise<UrlResponse> {
    try {
      const { url, userId } = data;

      const shortUrl = shortid.generate();

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const created = await this.urlRepository.shortUrl({
        userId,
        shortUrl,
        originalUrl: url,
        expiresAt,
      });

      if (!created) {
        return {
          status: false,
          message: responseMessage.ERROR_MESSAGE,
          shortUrl: "",
        };
      }

      return {
        status: true,
        message: responseMessage.SUCCESS_MESSAGE,
        shortUrl: shortUrl,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || responseMessage.ERROR_MESSAGE,
        shortUrl: "",
      };
    }
  }

  async getByShortUrl(shortUrl: string) {
    try {
      const urlDoc = await this.urlRepository.findByShortUrl(shortUrl);
      if (!urlDoc) {
        console.log(`Short URL not found: ${shortUrl}`);
      }
      return urlDoc;
    } catch (error: any) {
      console.error("Service Error in getByShortUrl:", error.message, error);
      return null;
    }
  }

  async incrementVisitCount(shortUrl: string) {
    try {
      const result = await this.urlRepository.incrementVisitCount(shortUrl);
      if (!result) {
        console.log(`Failed to increment visit count for: ${shortUrl}`);
      }
      return result;
    } catch (error: any) {
      console.log(
        "Service Error in incrementVisitCount:",
        error.message,
        error
      );
      return null;
    }
  }
}

export const urlService = Container.get(UrlService);
