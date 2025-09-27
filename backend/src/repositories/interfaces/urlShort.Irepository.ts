import { ICreateShortUrlDTO } from "../../dtos/urlShort.dtos";
import { IUrl } from "../../models/url.model";

export interface IUrlRepository {
  shortUrl(data: ICreateShortUrlDTO): Promise<IUrl | null>;
  findByShortUrl(shortUrl: string): Promise<IUrl | null>;
  incrementVisitCount(shortUrl: string): Promise<any>;
  findByUserId(
    userId: string,
    page?: number,
    limit?: number,
    query?: string 
  ): Promise<{
    urls: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;
  findByOriginalUrlAndUserId(
    userId: string,
    originalUrl: string
  ): Promise<IUrl | null>;
}
