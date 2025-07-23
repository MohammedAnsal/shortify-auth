import { RequestUrl } from "../../dtos/urlShort.dtos";
import { UrlResponse } from "../../interfaces/urlShort.interface";
import { IUrl } from "../../models/url.model";

export interface IUrlService {
  shortUrl(data: RequestUrl): Promise<UrlResponse>;
  getByShortUrl(shortUrl: string): Promise<IUrl | null>;
  incrementVisitCount(shortUrl: string): Promise<any>;
}
