import type { GetResponse, HttpMethod, RequestOptions, TCallback } from './types';
import { HttpStatus } from './enums';

export class Loader {
  private readonly baseLink: string;
  private readonly options: RequestOptions;

  constructor(baseLink: string, options: RequestOptions = {}) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResp<T>(
    { endpoint, options = {} }: GetResponse,
    callback: TCallback<T> = (): void => {
      console.error('No callback for GET response');
    }
  ): Promise<void> {
    return this.load('GET', endpoint, callback, options);
  }

  private errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === HttpStatus.Unauthorized || res.status === HttpStatus.NotFound)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  private makeUrl(options: RequestOptions, endpoint: string): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load<T>(
    method: HttpMethod,
    endpoint: string,
    callback: TCallback<T>,
    options: RequestOptions
  ): Promise<void> {
    return fetch(this.makeUrl(options, endpoint), { method })
      .then((res) => this.errorHandler(res))
      .then((res: Response): Promise<T> => res.json())
      .then((data: T): void => callback(data))
      .catch((err: Error): never => {
        console.error(err);
        throw err;
      });
  }
}
