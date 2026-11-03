import { cloneElement, queryElement } from '../../../utils/helpers';
import type { NewsArticle, NewsElements } from './types';
import { ClassNames, CssSelectors } from './enums';
import './news.css';

const MAX_NEWS_ITEMS = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.jpg';

class News {
  private readonly newsItemTemp: HTMLTemplateElement | null;
  private readonly newsContainer: HTMLDivElement | null;

  constructor() {
    this.newsItemTemp = queryElement(HTMLTemplateElement, CssSelectors.NewsItemTemplate);
    this.newsContainer = queryElement(HTMLDivElement, CssSelectors.NewsContainer);
  }

  public draw(data: NewsArticle[]): void {
    const tempItem = this.newsItemTemp;
    if (!tempItem || !this.newsContainer) {
      console.warn('newsFile: Required DOM elements not found');
      return;
    }

    const news = data.length >= MAX_NEWS_ITEMS ? data.slice(0, MAX_NEWS_ITEMS) : data;

    const fragment = document.createDocumentFragment();
    news.forEach((item, idx) => {
      const clone = this.createNewsItem(tempItem, item, idx);
      if (clone) fragment.append(clone);
    });

    this.newsContainer.innerHTML = '';
    this.newsContainer.appendChild(fragment);
  }

  private createNewsItem(tempItem: HTMLTemplateElement, item: NewsArticle, idx: number): DocumentFragment | null {
    const clone: DocumentFragment = cloneElement(tempItem);

    const elements: NewsElements | null = this.getElementRefs(clone);
    if (!elements) {
      console.warn('newsFile: One or more required elements not found in template');
      return null;
    }

    elements.item.classList.add(idx % 2 ? ClassNames.Alt : ClassNames.Default);

    this.populateElement(elements, item);
    return clone;
  }

  private getElementRefs(clone: DocumentFragment): NewsElements | null {
    const item = queryElement(HTMLDivElement, CssSelectors.NewsItem, clone);
    const photo = queryElement(HTMLDivElement, CssSelectors.NewsMetaPhoto, clone);
    const author = queryElement(HTMLLIElement, CssSelectors.NewsMetaAuthor, clone);
    const date = queryElement(HTMLLIElement, CssSelectors.NewsMetaDate, clone);
    const title = queryElement(HTMLHeadingElement, CssSelectors.NewsDescriptionTitle, clone);
    const source = queryElement(HTMLHeadingElement, CssSelectors.NewsDescriptionSource, clone);
    const content = queryElement(HTMLParagraphElement, CssSelectors.NewsDescriptionContent, clone);
    const link = queryElement(HTMLAnchorElement, CssSelectors.NewsReadMoreLink, clone);

    if (!item || !photo || !author || !date || !title || !source || !content || !link) {
      return null;
    }

    return { item, photo, author, date, title, source, content, link };
  }

  private populateElement(el: NewsElements, item: NewsArticle): void {
    el.photo.style.backgroundImage = `url(${item.urlToImage || PLACEHOLDER_IMAGE})`;
    el.author.textContent = item.author || item.source.name;
    el.date.textContent = this.formatDate(item.publishedAt);
    el.title.textContent = item.title ?? '';
    el.source.textContent = item.source.name;
    el.content.textContent = item.description ?? '';
    el.link.setAttribute('href', item.url);
  }

  private formatDate(publishedAt: string): string {
    return publishedAt.slice(0, 10).split('-').reverse().join('-');
  }
}

export default News;
