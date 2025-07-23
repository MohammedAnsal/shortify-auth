export interface RequestUrl {
  url: string;
  userId: string;
}

export interface ICreateShortUrlDTO {
  userId: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt: Date;
}
