import { AppController } from '../controller/controller';
import { AppView } from '../view/appView';

import { getCollection, queryElement } from '../../utils/helpers';

import type { ApiNewsResponse } from '../view/news/types';
import type { ApiSourceResponse } from '../view/sources/types';

import { ButtonsClassNames, ButtonsSelectors, CssSelectors } from './enums';
import { SourceItemsClassNames, SourcesCssSelectors } from '../view/sources/enums';

export class App {
  private controller: AppController;
  private view: AppView;

  private sourcesContainer!: HTMLDivElement;
  private buttonPrev!: HTMLButtonElement;
  private buttonNext!: HTMLButtonElement;

  private totalSources: number = 0;
  private firstSourceIndex: number = 0;
  private scrollStep: number = 7;
  private lastSourceIndex: number = 0;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  private initCarousel(): void {
    this.sourcesContainer = queryElement(HTMLDivElement, SourcesCssSelectors.SourcesContainer);
    this.buttonPrev = queryElement(HTMLButtonElement, ButtonsSelectors.PreviousButton);
    this.buttonNext = queryElement(HTMLButtonElement, ButtonsSelectors.NextButton);

    this.buttonPrev.addEventListener('click', (): void => {
      this.hideVisibleSources();
      this.lastSourceIndex = Math.max(0, this.firstSourceIndex - 1);
      this.prevSourcesItems();
      this.updateButtonStates();
    });

    this.buttonNext.addEventListener('click', (): void => {
      const maxIndex: number = this.totalSources - this.scrollStep;
      if (this.firstSourceIndex < maxIndex) {
        this.hideVisibleSources();
        this.firstSourceIndex = Math.min(maxIndex, this.lastSourceIndex + 1);
        this.nextSourcesItems();
      }
      this.updateButtonStates();
    });

    this.sourcesContainer.addEventListener('click', (e: Event): void => {
      this.controller.getNews(e, (data: ApiNewsResponse): void => {
        this.view.drawNews(data);
        this.markActiveSource(e);
      });
    });

    this.updateScrollStep();
    window.addEventListener('resize', (): void => {
      this.updateScrollStep();
      if (this.totalSources === 0) {
        return;
      }
      this.nextSourcesItems();
      this.updateButtonStates();
    });
  }

  private updateScrollStep(): void {
    const width: number = window.innerWidth;
    if (width >= 1200) {
      this.scrollStep = 7;
    } else if (width >= 768) {
      this.scrollStep = 5;
    } else if (width >= 480) {
      this.scrollStep = 3;
    } else if (width >= 360) {
      this.scrollStep = 2;
    } else {
      this.scrollStep = 1;
    }
  }

  private updateButtonStates(): void {
    if (this.firstSourceIndex <= 0) {
      this.buttonPrev.classList.add(ButtonsClassNames.DisabledButton);
      this.buttonPrev.classList.remove(ButtonsClassNames.ActiveButton);
    } else {
      this.buttonPrev.classList.remove(ButtonsClassNames.DisabledButton);
      this.buttonPrev.classList.add(ButtonsClassNames.ActiveButton);
    }

    if (this.lastSourceIndex === this.totalSources - 1) {
      this.buttonNext.classList.add(ButtonsClassNames.DisabledButton);
      this.buttonNext.classList.remove(ButtonsClassNames.ActiveButton);
    } else {
      this.buttonNext.classList.remove(ButtonsClassNames.DisabledButton);
      this.buttonNext.classList.add(ButtonsClassNames.ActiveButton);
    }
  }

  private markActiveSource(e: Event): void {
    if (!(e.target instanceof Element)) {
      return;
    }

    const target = e.target.closest<HTMLElement>(SourcesCssSelectors.SourceItem);
    if (!target) {
      return;
    }

    // Снимаем active со всех, ставим только на текущий
    this.sourcesContainer
      .querySelectorAll<HTMLElement>(SourcesCssSelectors.SourceItem)
      .forEach((el) => el.classList.remove(SourceItemsClassNames.ActiveSource));

    target.classList.add(SourceItemsClassNames.ActiveSource);
  }

  private hideVisibleSources(): void {
    const sources = getCollection(HTMLDivElement, SourcesCssSelectors.SourceItem, this.sourcesContainer);

    for (let i: number = this.firstSourceIndex; i <= this.lastSourceIndex; i++) {
      const item = sources[i];
      if (item) {
        item.classList.add(SourceItemsClassNames.HiddenSource);
      }
    }
  }

  private prevSourcesItems(): void {
    const sourceWidth: number = this.sourcesContainer.getBoundingClientRect().width;
    const sources = getCollection(HTMLDivElement, SourcesCssSelectors.SourceItem, this.sourcesContainer);

    let counter: number = this.lastSourceIndex;
    let sumWidth: number = 0;
    while (counter >= 0) {
      const source = sources[counter];
      if (!source) break;

      source.classList.remove(SourceItemsClassNames.HiddenSource);
      sumWidth += source.offsetWidth + 16;

      if (sumWidth > sourceWidth) {
        source.classList.add(SourceItemsClassNames.HiddenSource);
        break;
      }

      counter--;
    }

    this.firstSourceIndex = Math.max(0, counter + 1);
  }

  private nextSourcesItems(): void {
    const sourceWidth: number = this.sourcesContainer.getBoundingClientRect().width;
    const sources = getCollection(HTMLDivElement, SourcesCssSelectors.SourceItem, this.sourcesContainer);

    let counter: number = this.firstSourceIndex;
    let sumWidth: number = 0;
    while (counter < sources.length) {
      const source = sources[counter];
      if (!source) break;

      source.classList.remove(SourceItemsClassNames.HiddenSource);
      sumWidth += source.offsetWidth + 16;

      if (sumWidth > sourceWidth) {
        source.classList.add(SourceItemsClassNames.HiddenSource);
        break;
      }

      counter++;
    }

    this.lastSourceIndex = counter - 1;
  }

  private initButtonsStates(): void {
    this.buttonPrev.classList.add(ButtonsClassNames.DisabledButton);
    this.buttonPrev.classList.remove(ButtonsClassNames.HiddenButton);

    this.buttonNext.classList.remove(ButtonsClassNames.HiddenButton);

    if (this.totalSources < this.scrollStep) {
      this.buttonNext.classList.add(ButtonsClassNames.DisabledButton);
    } else {
      this.buttonNext.classList.add(ButtonsClassNames.ActiveButton);
    }
  }

  private setCurrentYear(): void {
    const currentYearBox = queryElement(HTMLParagraphElement, CssSelectors.YearItem);
    currentYearBox.textContent = new Date().getFullYear().toString();
  }

  public start(): void {
    this.setCurrentYear();
    this.initCarousel();

    this.controller.getSources((data: ApiSourceResponse): void => {
      this.view.drawSources(data);

      this.totalSources = this.sourcesContainer.children.length;

      if (this.totalSources > 0) {
        this.initButtonsStates();
        this.nextSourcesItems();
      }
    });
  }
}
