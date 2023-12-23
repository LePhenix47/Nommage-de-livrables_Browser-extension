import { selectQuery, selectQueryAll } from "@utils/dom.helpers";
import { valuesToBeRetrieved } from "@utils/variables";
import WebStorageService from "@utils/web-storage.service";
declare const chrome: any;

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

  if (!mainHeadingElement) {
    throw new Error("No h1 element found");
  }

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
async function getFromLocalStorageFormattedInfo(): Promise<
  Map<string, string>
> {
  const valuesMap = new Map<string, string>();

  for (const value of valuesToBeRetrieved) {
    const realValue: string = value.split("_")[1];

    const valueOnLocalStorage: string = await chrome.storage.sync.get(value);

    if (!valueOnLocalStorage) {
      throw new Error(`${realValue} does not exist on local storage`);
    }

    switch (realValue) {
      case "date": {
        //@ts-ignore
        const formattedDate: string = new Date(valueOnLocalStorage?.ndl_date)
          .toLocaleString("fr-FR", {
            year: "numeric",
            month: "2-digit",
          })
          .replaceAll("/", "");

        valuesMap.set(realValue, formattedDate);
        break;
      }

      default: {
        valuesMap.set(realValue, valueOnLocalStorage[value]);
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
    throw new Error(
      "Child elements to be updated (<ul> or array of <li>s) not found"
    );
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
async function modifyElements(): Promise<void> {
  const elementToModifyMap: Map<string, HTMLElement[]> = getElementsToModify();

  const studentInfoMap: Map<string, string> =
    await getFromLocalStorageFormattedInfo();

  console.log(studentInfoMap);

  const studentFullName: string = `${studentInfoMap.get(
    "lastName"
  )}_${studentInfoMap.get("firstName")}`;

  const formattedTitle: string = `${getFormattedProjectTitle()}_${studentFullName}`;

  const emElementForTitle: HTMLElement = document.createElement<"em">("em");
  const titleElement: HTMLElement = elementToModifyMap.get("title")[0];
  emElementForTitle.textContent = formattedTitle;
  titleElement.innerHTML = "";
  // Append the <em> element to the end of the <li>
  titleElement.appendChild(emElementForTitle);

  const listItemsArray: HTMLElement[] = elementToModifyMap.get("list-items");

  const formattedDate: string = studentInfoMap.get("date");
  for (const listItem of listItemsArray) {
    // Create a new <em> element
    const emElementForLI: HTMLElement = document.createElement<"em">("em");

    const formattedTextForEmphase: string = listItem.innerText
      .replaceAll("Nom_Prénom", studentFullName)
      .replaceAll("mmaaaa", formattedDate);

    listItem.innerHTML = "";

    emElementForLI.textContent = formattedTextForEmphase;

    // Append the <em> element to the end of the <li>
    listItem.appendChild(emElementForLI);
  }
}

/**
 * Modifies elements on a webpage by calling the `modifyElements` function.
 * If an error occurs during the modification process, the script retries after a delay.
 * The script stops if the maximum number of retries is reached or if the loading spinner is still present after multiple attempts.
 */
function setDeliverablesName(): void {
  const MAX_CALLSTACK: number = 15;
  let calls: number = 0;

  startScript();
  console.log(
    "%cThe script started!",
    "padding:5px; font-size: 16px; background: darkblue; color:white;"
  );

  function startScript(timeout: number = 0) {
    const ocSpinnerPage = selectQuery<HTMLDivElement>("div.oc-spinnerPage");
    if (ocSpinnerPage) {
      startScript(timeout);
    }

    const MAX_CALLSTACK_EXCEEDED: boolean = calls >= MAX_CALLSTACK;
    if (MAX_CALLSTACK_EXCEEDED) {
      console.log(
        `%cMax call stack exceeded (${MAX_CALLSTACK} calls MAX), the script will stop to avoid infinite loops, please reload the page to restart the script`,
        "padding:5px; font-size: 16px; background-color: red; color:white;"
      );
      return;
    }

    setTimeout(async () => {
      try {
        await modifyElements();
        console.log(
          "%cThe script worked!",
          "padding:5px; font-size: 16px; background: green; color:white;"
        );
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
}
setDeliverablesName();

console.log("Hello content.ts");
