import type { ApiNewsResponse, NewsArticle } from './news/types';
import { News } from './news/news';

import type { ApiSourceResponse, SourceItem } from './sources/types';
import { Sources } from './sources/sources';

export class AppView {
  private news: News;
  private sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: ApiNewsResponse): void {
    const values: NewsArticle[] = data.articles ?? [];
    this.news.draw(values);
  }

  public drawSources(data: ApiSourceResponse): void {
    const values: SourceItem[] = data.sources ?? [];
    this.sources.draw(values);
  }
}
