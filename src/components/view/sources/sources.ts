import { cloneElement, queryElement } from '../../../utils/helpers';
import { SourcesCssSelectors, DataAttributes } from './enums';
import type { SourceItem } from './types';
import './sources.css';

export class Sources {
  public draw(data: SourceItem[]): void {
    const sourcesContainer = queryElement(HTMLDivElement, SourcesCssSelectors.SourcesContainer);
    sourcesContainer.innerHTML = '';

    if (!data?.length) {
      this.drawEmpty(sourcesContainer);
      return;
    }

    try {
      const sourceItemTemp = queryElement(HTMLTemplateElement, SourcesCssSelectors.SourceItemTemplate);
      const fragment = document.createDocumentFragment();
      data.forEach((item: SourceItem): void => {
        fragment.append(this.drawItem(sourceItemTemp, item));
      });
      sourcesContainer.append(fragment);
    } catch (error) {
      console.log('Sources -> draw failed: ', error);
      this.drawEmpty(sourcesContainer);
    }
  }

  private drawItem(itemTemplate: HTMLTemplateElement, item: SourceItem): Node {
    const sourceClone: DocumentFragment = cloneElement(itemTemplate);
    const nameElement: HTMLSpanElement = queryElement(HTMLSpanElement, SourcesCssSelectors.SourceItemName, sourceClone);
    const idElement: HTMLDivElement = queryElement(HTMLDivElement, SourcesCssSelectors.SourceItem, sourceClone);

    nameElement.textContent = item.name;
    idElement.setAttribute(DataAttributes.SourceId, item.id);

    return sourceClone;
  }

  private drawEmpty(container: HTMLDivElement): void {
    const emptyTemp = document.querySelector<HTMLTemplateElement>(SourcesCssSelectors.SourceEmptyTemplate);
    if (!emptyTemp) {
      container.textContent = 'No sources available';
      return;
    }
    container.appendChild(cloneElement(emptyTemp));
  }
}
