import './sources.css';

interface ISourceItem {
  id: string;
  name: string;
}

class Sources {
  public draw(data: ISourceItem[]): void {
    const sourcesContainer: HTMLElement | null = document.querySelector('.sources');
    const sourceItemTemp: HTMLTemplateElement | null = document.querySelector('#sourceItemTemp');

    if (sourceItemTemp && sourcesContainer) {
      const fragment: DocumentFragment = document.createDocumentFragment();
      data.forEach((item: ISourceItem) => {
        const sourceClone: DocumentFragment = sourceItemTemp.content.cloneNode(true) as DocumentFragment;

        const nameElement: HTMLElement | null = sourceClone.querySelector('.source__item-name');
        const idElement: HTMLElement | null = sourceClone.querySelector('.source__item');

        if (nameElement && idElement) {
          nameElement.textContent = item.name;
          idElement.setAttribute('data-source-id', item.id);
          fragment.append(sourceClone);
        }
      });

      sourcesContainer.append(fragment);
    }
  }
}

export default Sources;
