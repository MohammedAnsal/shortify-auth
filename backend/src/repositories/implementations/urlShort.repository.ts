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

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 3,
    search: string = ""
  ): Promise<{
    urls: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const query: any = { userId };
      if (search) {
        query.originalUrl = { $regex: search, $options: "i" };
      }

      const [urls, total] = await Promise.all([
        UrlModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        UrlModel.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        urls,
        total,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("Repository Error in findByUserId:", error);
      throw error;
    }
  }

  async findByOriginalUrlAndUserId(
    userId: string,
    originalUrl: string
  ): Promise<IUrl | null> {
    try {
      return await UrlModel.findOne({ userId, originalUrl });
    } catch (error) {
      console.error("Repository Error in findByOriginalUrlAndUserId:", error);
      return null;
    }
  }
}

export const urlRepository = Container.get(UrlRepository);
