import { ICreateShortUrlDTO } from "../../dtos/urlShort.dtos";
import { IUrl } from "../../models/url.model";

export interface IUrlRepository {
  shortUrl(data: ICreateShortUrlDTO): Promise<IUrl | null>;
  findByShortUrl(shortUrl: string): Promise<IUrl | null>;
  incrementVisitCount(shortUrl: string): Promise<any>;
}
