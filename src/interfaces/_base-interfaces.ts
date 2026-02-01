export interface HttpResponse<T> {
  data?: T;
  error?: string;
  message: string;
  statusCode: number;
}