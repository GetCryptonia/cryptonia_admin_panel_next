export class ApiClientError extends Error {
  statusCode: number;
  error?: string;

  constructor(message: string, statusCode: number, error?: string) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.error = error;
  }
}
