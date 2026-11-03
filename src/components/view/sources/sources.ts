import { cloneElement, queryElement } from '../../../utils/helpers';
import { CssSelectors, DataAttributes } from './enums';
import type { SourceItem } from './types';
import './sources.css';

export class Sources {
  private checkInputData(data: SourceItem[]): void {
    if (!data?.length) {
      throw new Error('Sources: no data to draw');
    }
  }

  private drawItem(itemTemplate: HTMLTemplateElement, item: SourceItem): Node {
    const sourceClone: DocumentFragment = cloneElement(itemTemplate);

    const nameElement: HTMLSpanElement = queryElement(HTMLSpanElement, CssSelectors.SourceItemName, sourceClone);
    const idElement: HTMLDivElement = queryElement(HTMLDivElement, CssSelectors.SourceItem, sourceClone);

    nameElement.textContent = item.name;
    idElement.setAttribute(DataAttributes.SourceId, item.id);

    return sourceClone;
  }

  public draw(data: SourceItem[]): void {
    try {
      this.checkInputData(data);
      const sourcesContainer: HTMLDivElement = queryElement(HTMLDivElement, CssSelectors.SourcesContainer);
      const sourceItemTemp: HTMLTemplateElement = queryElement(HTMLTemplateElement, CssSelectors.SourceItemTemplate);

      const fragment: DocumentFragment = document.createDocumentFragment();
      data.forEach((item: SourceItem): void => {
        const sourceClone: Node = this.drawItem(sourceItemTemp, item);
        fragment.append(sourceClone);
      });

      sourcesContainer.append(fragment);
    } catch (error) {
      console.log('Sources -> draw failed: ', error);
    }
  }
}
