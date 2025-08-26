export interface ApiError {
    response: string;
    status: number;
    message: string;
    name: string;
    issues?: any;
    statusCode?: number;
  }
  