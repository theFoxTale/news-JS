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
    const newsContainer = checkEventTargetElement(HTMLElement, e.currentTarget);
    let node = checkEventTargetElement(HTMLElement, e.target);

    while (node !== newsContainer) {
      if (node.classList.contains(SourcesCssSelectors.SourceItem)) {
        const sourceId = node.getAttribute(DataAttributes.SourceId);

        if (sourceId && newsContainer.getAttribute(DataAttributes.Source) !== sourceId) {
          newsContainer.setAttribute(DataAttributes.Source, sourceId);
          super.getResp(
            {
              endpoint: ApiEndpoints.Everything,
              options: {
                sources: sourceId,
              },
            },
            callback
          );
        }
        return;
      }

      const parent = node.parentElement;
      if (parent === null) {
        break;
      }
      node = parent;
    }
  }
}
