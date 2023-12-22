import { selectQuery, selectQueryAll } from "@utils/dom.helpers";
import WebStorageService from "@utils/web-storage.service";

/**
 * Retrieves the formatted project title by selecting the main heading element and replacing all spaces with underscores.
 *
 * @returns The formatted project title as a string.
 *
 * @example
 * ```typescript
 * const formattedTitle: string = getFormattedProjectTitle();
 * console.log(formattedTitle); // Output: "Formatted_Project_Title"
 * ```
 */
function getFormattedProjectTitle(): string {
  const mainHeadingElement = selectQuery<HTMLHeadingElement>("h1");

  const formattedTitle: string = mainHeadingElement.innerText.replaceAll(
    " ",
    "_"
  );

  return formattedTitle;
}

/**
 * Retrieves specific values from the local storage and formats them based on their type.
 *
 * @returns A Map object containing the retrieved values from the local storage, where the keys are the real value names and the values are the formatted values.
 *
 * @example
 * ```typescript
 * const valuesMap: Map<string, string> = getFromLocalStorageFormattedInfo();
 * console.log(valuesMap);
 * // Output: Map { "first-name" => "John", "last-name" => "Doe", "date" => "2022-01" }
 * ```
 */
function getFromLocalStorageFormattedInfo(): Map<string, string> {
  const valuesToBeRetrieved = [
    "ndl-extension_first-name",
    "ndl-extension_last-name",
    "ndl-extension_date",
  ] as const;

  const valuesMap = new Map<string, string>();

  for (const value of valuesToBeRetrieved) {
    const realValue: string = value.split("_")[1];

    const valueOnLocalStorage: string = WebStorageService.getKey<string>(value);

    if (!valueOnLocalStorage) {
      throw new Error(`${realValue} does not exist on local storage`);
    }

    switch (realValue) {
      case "date": {
        const formattedDate: string = new Date(valueOnLocalStorage)
          .toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
          })
          .replaceAll("/", "");

        valuesMap.set(realValue, formattedDate);
        break;
      }

      default: {
        valuesMap.set(realValue, valueOnLocalStorage);
        break;
      }
    }
  }

  return valuesMap;
}

/**
 * Retrieves specific elements from the DOM and returns them in a `Map`.
 *
 * @returns A `Map` object containing the selected elements from the DOM. The keys are `"title"` and `"list-items"`, and the values are arrays of HTMLElement objects.
 */
function getElementsToModify(): Map<string, HTMLElement[]> {
  /**
   * All the `<aside>` in the page
   */
  const arrayOfAsides = selectQueryAll<HTMLElement>(
    `aside[data-claire-semantic="information"]`
  );

  const deliverablesAside: HTMLElement | undefined = arrayOfAsides.find(
    (aside) => {
      const isDeliverableAside: boolean =
        aside.innerText.includes("Dupont_Jean");
      if (isDeliverableAside) {
        return aside;
      }
    }
  );

  if (!deliverablesAside) {
    throw new Error("Aside not found");
  }

  const titleToReplace = selectQuery<HTMLParagraphElement>(
    "p>strong",
    deliverablesAside
  );

  const unorderedList = selectQuery<HTMLUListElement>("ul", deliverablesAside);

  const listItemsOfUList = selectQueryAll<HTMLLIElement>("li", unorderedList);

  if (!unorderedList || !listItemsOfUList) {
    throw new Error("Child elements to be updated not found");
  }

  const elementsMap = new Map<string, HTMLElement[]>();
  elementsMap.set("title", [titleToReplace]);
  elementsMap.set("list-items", listItemsOfUList);

  return elementsMap;
}

/**
 * Modifies specific elements in the `<aside>` for the deliverables
 *
 */
function modifyElements(): void {
  const elementToModifyMap: Map<string, HTMLElement[]> = getElementsToModify();

  const formattedTitle: string = getFormattedProjectTitle();
  const titleElement: HTMLElement = elementToModifyMap.get("title")[0];
  titleElement.textContent = formattedTitle;

  const studentInfoMap: Map<string, string> =
    getFromLocalStorageFormattedInfo();

  const studentFullName: string = `${studentInfoMap.get(
    "last-name"
  )}_${studentInfoMap.get("first-name")}`;

  const listItemsArray: HTMLElement[] = elementToModifyMap.get("list-items");

  const formattedDate: string = studentInfoMap.get("date");
  for (const listItem of listItemsArray) {
    const [deliverableNameEm, monthYearEm] = Array.from(listItem.children);

    if (studentFullName) {
      deliverableNameEm.textContent = (
        deliverableNameEm as HTMLParagraphElement
      ).innerText.replaceAll("Nom_Prénom", studentFullName);
    }

    if (formattedDate) {
      monthYearEm.textContent = (
        monthYearEm as HTMLParagraphElement
      ).innerText.replaceAll("mmaaaa", formattedDate);
    }
  }
}

function setDeliverablesName() {
  const MAX_CALLSTACK: number = 15;
  let calls: number = 0;

  const MAX_CALLSTACK_EXCEEDED = calls > MAX_CALLSTACK;
  if (MAX_CALLSTACK_EXCEEDED) {
    console.log(
      "%cMax calling stack exceeded (10 calls MAX), the script will stop to avoid infinite loops, please reload the page",
      "padding:5px; font-size: 16px; background-color: red; color:white;"
    );
    return;
  }

  startScript(3_000);

  function startScript(timeout: number) {
    setTimeout(() => {
      try {
        modifyElements();
        return;
      } catch (error) {
        console.log(
          `%c${error}`,
          "padding:5px; font-size: 16px; background-color: darkred; color:white;"
        );
        calls++;
        startScript(500);
      }
    }, timeout);
  }

  console.log(
    "%cThe script worked!",
    "padding:5px; font-size: 24px; background: green; color:white;"
  );
}
setDeliverablesName();

console.log("Hello content.ts");
