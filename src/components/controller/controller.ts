import { AppLoader } from './appLoader';
import { checkEventTargetElement } from '../../utils/helpers';

import { ApiEndpoints } from './enums';
import { DataAttributes, SourcesCssSelectors } from '../view/sources/enums';

import type { ApiSourceResponse } from '../view/sources/types';
import type { ApiNewsResponse } from '../view/news/types';

export class AppController extends AppLoader {
  public getSources(callback: (data: ApiSourceResponse) => void): void {
    super.getResp(
      {
        endpoint: ApiEndpoints.Sources,
      },
      callback
    );
  }

  public getNews(e: Event, callback: (data: ApiNewsResponse) => void): void {
    if (!(e.target instanceof Element)) {
      return;
    }

    // Ищем ближайший .source__item, но только внутри newsContainer
    const newsContainer = checkEventTargetElement(HTMLElement, e.currentTarget);
    const sourceItem = e.target.closest<HTMLElement>(SourcesCssSelectors.SourceItem);
    if (!sourceItem || sourceItem === newsContainer || !newsContainer.contains(sourceItem)) {
      return;
    }

    const sourceId = sourceItem.getAttribute(DataAttributes.SourceId);
    if (!sourceId) {
      return;
    }
    if (newsContainer.getAttribute(DataAttributes.Source) === sourceId) {
      return;
    }

    newsContainer.setAttribute(DataAttributes.Source, sourceId);
    super.getResp(
      {
        endpoint: ApiEndpoints.Everything,
        options: { sources: sourceId },
      },
      callback
    );
  }
}
