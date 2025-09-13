export interface Result {
  success: boolean;
  message?: string;
  code?: string;
}

export interface ApiResponse<T> {
  result: Result;
  data: T | null;
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { result: { success: true, message }, data };
}

export function fail<T = never>(message: string, code?: string): ApiResponse<T> {
  return { result: { success: false, message, code }, data: null };
}
