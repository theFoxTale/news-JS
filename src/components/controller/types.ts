export interface RequestOptions {
  [apiKey: string]: string;
}

export interface GetResponse {
  endpoint: string;
  options?: RequestOptions;
}

export type TCallback<T> = (data: T) => void;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
