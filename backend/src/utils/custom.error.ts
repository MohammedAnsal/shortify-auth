export class AppError extends Error {
  constructor(
      public readonly statusCode: number = 400,
      public readonly message: string
  ) {
    super(message);
    this.name = "AppError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
