export class ApiError extends Error {
  public statusCode: number;
  public error: string;

  constructor(message: string, error: string, statusCode: number) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}