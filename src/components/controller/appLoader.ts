import { Loader } from './loader';
import type { RequestOptions } from './types';

export class AppLoader extends Loader {
  constructor() {
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error('API_URL or API_KEY are not defined, check your .env file');
    }

    const options: RequestOptions = { apiKey };
    super(apiUrl, options);
  }
}

export default AppLoader;
