import './news.css';

interface NewsArticle {
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

interface NewsElements {
  item: HTMLElement;
  photo: HTMLElement;
  author: HTMLElement;
  date: HTMLElement;
  title: HTMLElement;
  source: HTMLElement;
  content: HTMLElement;
  link: HTMLElement;
}

const MAX_NEWS_ITEMS = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.jpg';

class News {
  private readonly newsItemTemp: HTMLTemplateElement | null;
  private readonly newsContainer: HTMLElement | null;

  constructor() {
    this.newsItemTemp = document.querySelector('#newsItemTemp');
    this.newsContainer = document.querySelector('.news');
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
    const clone: DocumentFragment = tempItem.content.cloneNode(true) as DocumentFragment;

    const elements: NewsElements | null = this.getElementRefs(clone);
    if (!elements) {
      console.warn('newsFile: One or more required elements not found in template');
      return null;
    }

    if (idx % 2) {
      elements.item.classList.add('alt');
    }

    this.populateElement(elements, item);
    return clone;
  }

  private getElementRefs(clone: DocumentFragment): NewsElements | null {
    const item = clone.querySelector<HTMLElement>('.news__item');
    const photo = clone.querySelector<HTMLElement>('.news__meta-photo');
    const author = clone.querySelector<HTMLElement>('.news__meta-author');
    const date = clone.querySelector<HTMLElement>('.news__meta-date');
    const title = clone.querySelector<HTMLElement>('.news__description-title');
    const source = clone.querySelector<HTMLElement>('.news__description-source');
    const content = clone.querySelector<HTMLElement>('.news__description-content');
    const link = clone.querySelector<HTMLElement>('.news__read-more a');

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
