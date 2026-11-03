export interface NewsArticle {
  urlToImage: string | null;
  author: string | null;
  publishedAt: string;
  title: string | null;
  description: string | null;
  url: string;
  source: {
    name: string;
  };
}

export interface NewsElements {
  item: HTMLElement;
  photo: HTMLElement;
  author: HTMLElement;
  date: HTMLElement;
  title: HTMLElement;
  source: HTMLElement;
  content: HTMLElement;
  link: HTMLElement;
}

// {"status":"ok","totalResults":2836,"articles":[]}
export interface ApiNewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}
