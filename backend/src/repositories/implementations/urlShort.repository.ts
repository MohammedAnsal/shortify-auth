import Container, { Service } from "typedi";
import { IUrlRepository } from "../interfaces/urlShort.Irepository";
import { IUrl, UrlModel } from "../../models/url.model";
import { ICreateShortUrlDTO } from "../../dtos/urlShort.dtos";

@Service()
class UrlRepository implements IUrlRepository {

  async shortUrl(data: ICreateShortUrlDTO): Promise<IUrl | null> {
    try {
      const { userId, shortUrl, originalUrl, expiresAt } = data;

      return await UrlModel.create({
        userId,
        shortUrl,
        originalUrl,
        expiresAt,
        visitCount: 0,
      });
    } catch (error: any) {
      console.error("DB Error in shortUrl:", error.message, error);
      return null;
    }
  }

  async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
    try {
      return await UrlModel.findOne({ shortUrl });
    } catch (error: any) {
      console.error("DB Error in findByShortUrl:", error.message, error);
      return null;
    }
  }

  async incrementVisitCount(shortUrl: string): Promise<any> {
    try {
      return await UrlModel.updateOne(
        { shortUrl },
        { $inc: { visitCount: 1 } }
      );
    } catch (error: any) {
      console.error("DB Error in incrementVisitCount:", error.message, error);
      return null;
    }
  }
}

export const urlRepository = Container.get(UrlRepository);
