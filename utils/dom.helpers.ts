/**
 * A simplified version of `document.querySelector()`
 *
 * @param {string} query - CSS query of the HTML Element to select
 * @param {any} container - HTML Element to select the query from (default: document).
 *
 * @returns {HTMLElement} - The element selected or `null` if the element doesn't exist
 */
export function selectQuery<T extends HTMLElement | SVGElement>(
  query: string,
  container: any = document
): T | null {
  const hasNoParentContainer: boolean = container === document;
  if (hasNoParentContainer) {
    return document.querySelector(query) as T | null;
  }

  switch (true) {
    case container.tagName?.includes("-"): // Web component
      return container.shadowRoot?.querySelector(query) as T | null;

    case container instanceof HTMLTemplateElement: // Template element
      return document
        .importNode(container.content, true)
        .querySelector(query) as T | null;

    case container instanceof HTMLIFrameElement: // Iframe
      return container.contentDocument?.querySelector(query) as T | null;

    default:
      return container.querySelector(query) as T | null;
  }
}

/**
 * A simplified version of `document.querySelectorAll()`
 *
 * @param {string} query - CSS query of the HTML Elements to select
 * @param {any} container - HTML Element to select the query from (default: document).
 * @returns {HTMLElement[]} - An array with all the elements selected or `null` if the element doesn't exist
 */
export function selectQueryAll<T extends HTMLElement | SVGElement>(
  query: string,
  container: any = document
): T[] {
  const hasNoParentContainer: boolean = container === document;
  if (hasNoParentContainer) {
    return Array.from(document.querySelectorAll(query)) as T[];
  }

  switch (true) {
    case container.tagName?.includes("-"): // Web component
      return Array.from(
        container.shadowRoot?.querySelectorAll(query) || []
      ) as T[];

    case container instanceof HTMLTemplateElement: // Template element
      return Array.from(
        document.importNode(container.content, true).querySelectorAll(query)
      ) as T[];

    case container instanceof HTMLIFrameElement: // Iframe
      return Array.from(
        container.contentDocument?.querySelectorAll(query) || []
      ) as T[];

    default:
      return Array.from(container.querySelectorAll(query)) as T[];
  }
}
