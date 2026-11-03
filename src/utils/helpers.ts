/**
 * Безопасный для TypeScript querySelector
 *
 * @param selector - querySelector элемента
 * @param parent - родительский элемент, в котором мы ищем наш элемент
 * @return Element - найденный элемент
 * @throws Error - если элемент не найден, выбросит ошибку
 */
function getElement(selector: string, parent: Document | DocumentFragment = document): Element {
  const element: Element | null = parent.querySelector(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found in document`);
  }
  return element;
}

/**
 * Находит элемент на странице и проверяет, что у него корректный тип
 *
 * @param type - тип, которому должен соответствовать искомый элемент
 * @param selector - querySelector элемента
 * @param container - родительский элемент, в котором мы ищем наш элемент. По умолчанию это document
 * @return InstanceType<T>
 * @throws Error
 */
export function queryElement<T extends typeof Element>(
  type: T,
  selector: string,
  container: Document | DocumentFragment = document
): InstanceType<T> {
  const el: Element = getElement(selector, container);
  if (!(el instanceof type)) {
    throw new Error(`Selector "${selector}" returned the wrong type insteadof ${type.name}.`);
  }
  return el as InstanceType<T>;
}

/**
 * Функция проверяет, является ли переданный элемент корректным HTMLElement-ом переданного типа
 *
 * @param type - тип, которому должен соответствовать искомый элемент
 * @param element - элемент типа Element или EventTarget
 * @return InstanceType<T>
 * @throws Error
 */
export function checkEventTargetElement<T extends typeof Element>(
  type: T,
  element: EventTarget | null
): InstanceType<T> {
  if (element !== null && !(element instanceof type)) {
    throw new Error(`Required event elements not found.`);
  }
  return element as InstanceType<T>;
}

/**
 * Функция клонирует элемент template и проверяет, что он соответствует типу DocumentFragment
 *
 * @param template - HTMLTemplateElement, который будет скопирован
 * @return element - новый элемент - клон template с типом DocumentFragment
 */
export function cloneElement(template: HTMLTemplateElement): DocumentFragment {
  const element: Node = template.content.cloneNode(true);
  if (!(element instanceof DocumentFragment)) {
    throw new Error(`Node type = ${element.nodeType}, name = ${element.nodeName} is not an DocumentFragment.`);
  }
  return element;
}

/**
 * Безопасный для TypeScript querySelectorAll
 *
 * @param type - тип, которому должен соответствовать искомый элемент
 * @param selector - querySelector элемента
 * @param parent - родительский элемент, в котором мы ищем наш элемент
 * @return NodeListOf<InstanceType<T>> - коллекция найденных элементов
 * @throws Error - если элементы не найдены или не соответствуют типу
 */
export function getCollection<T extends typeof Element>(
  type: T,
  selector: string,
  parent: HTMLElement | Document = document // можно искать в document
): NodeListOf<InstanceType<T>> {
  const elementsCollection: NodeListOf<Element> = parent.querySelectorAll(selector);

  if (elementsCollection.length === 0) {
    throw new Error(`No collection found for selector "${selector}"`);
  }

  for (let i = 0; i < elementsCollection.length; i++) {
    if (!(elementsCollection[i] instanceof type)) {
      throw new Error(`Element at index ${i} for selector "${selector}" is not of type ${type.name}`);
    }
  }

  return elementsCollection as NodeListOf<InstanceType<T>>;
}
