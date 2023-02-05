/**
 * `console.log()` but with a simpler syntax
 *
 * @param  {...any} messages Dev messages to log to the console
 * @returns void
 */
function log(...messages) {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    console.log(i, message);
  }
}

console.log(
  "%cExecuting script...",
  "padding:5px; font-size: 24px; background-color: darkblue; color:white;"
);

/**
 * Gets the current date with the month and the year in this format: *mmYYYY*
 *
 * ex: `022023`
 * @returns Date
 */
function getDate() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const date = `${
    currentMonth < 10 ? "0" + currentMonth : currentMonth
  }${currentYear}`;

  return date;
}

/**
 * Replaces words or characters of a string with new ones
 *
 * @param stringOfText The entire string of text
 * @param textToBeReplaced Character or word be replaced
 * @param textToReplaceBy Character or word that will replace
 * @returns string
 */
function replaceText(stringOfText, textToBeReplaced, textToReplaceBy) {
  return stringOfText.replaceAll(textToBeReplaced, textToReplaceBy);
}

/**
 * Function that gets the stirng inside an HTML element
 *
 * @param HTMLElement An HTML element with text inside
 * @returns string of the HTML element
 */
function getInnerText(HTMLElement) {
  if (!HTMLElement?.innerText) {
    return "";
  }

  return HTMLElement.innerText;
}

/**
 *
 * @param string String of chracters to be formatted
 * @param typeOfFormatting Can be either lowercase, uppercase or titlecase
 * @returns Formatted string
 */
function formatText(string, typeOfFormatting) {
  switch (typeOfFormatting.toLowerCase()) {
    case "lowercase": {
      return string.toLowerCase();
    }
    case "uppercase": {
      return string.toUpperCase();
    }
    case "titlecase": {
      return (
        string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase()
      );
    }
  }
}

/**
 * A simplified version of `document.querySelector()`
 *
 * @param  query HTML Element to select
 * @param  container HTML Element to select the query from
 * @returns The element selected *or* `null` if the element doesn't exist
 */
function selectQuery(query, container) {
  if (container) {
    return container.querySelector(query);
  }
  return document.querySelector(query);
}

/**
 * A simplified version of `document.querySelectorAll()`
 *
 * @param  query HTML Element to select
 * @param  container HTML Element to select the query from
 * @returns An array with all the elements selected *or* `null` if the element doesn't exist
 */
function selectQueryAll(query, container) {
  if (container) {
    return Array.from(container.querySelectorAll(query));
  }
  return Array.from(document.querySelectorAll(query));
}

/**
 * Function that selects all the children of an HTML element
 *
 * @param  element HTML element with children
 * @returns Array with all the children of the element
 */
function getChildNodes(element) {
  log({ element });
  return Array.from(element.childNodes);
}

/**
 * Verifies that the URL is correct to avoid useless executions
 * @returns void
 */
function verifyUrl() {
  const currentURL = location.pathname;

  const rightPage = currentURL.includes("assignment");
  console.log({ currentURL });

  if (!rightPage) {
    return setDeliverablesName(currentTimeout);
  }
  return;
}
verifyUrl();

/**
 * Retrieves all the useful infos such as:
 * - The user's full name
 * - The title of the project
 * - The current date thanks to the function {@link getDate()}
 *
 * @returns  An object with all these infos
 */
function getAllUsefulInfos() {
  /**
   * Title of the project
   */
  const mainHeadingElement = selectQuery("h1");

  let mainHeadingText = getInnerText(mainHeadingElement);

  if (!mainHeadingText) {
    return {
      formattedTitle: null,
      formattedName: null,
      date: null,
    };
  }

  mainHeadingText = replaceText(mainHeadingText, " ", "_");

  /**
   * Button to open a dropdown menu with user's settings
   */
  const button = selectQuery("[data-testid='mainHeaderAvatar']");
  button.click(); //We click the button to open it

  //User full name
  const nameOfStudentElement = selectQuery("span.MuiTypography-root>strong");

  let formattedNameOfStudent = getInnerText(nameOfStudentElement);
  formattedNameOfStudent = replaceText(formattedNameOfStudent, " ", "_");

  //We click the button again to close it asynchronously
  setTimeout(() => {
    button.click();
  }, 0);

  /**
   * New title of the project with the name of the project and the full name of the user
   */
  const actualTitleOfProject = `${formatText(
    mainHeadingText,
    "titlecase"
  )}_${formatText(formattedNameOfStudent, "lowercase")}`;
  /**
   * Current date
   */
  const currentDate = getDate();

  return {
    formattedTitle: actualTitleOfProject,
    formattedName: formattedNameOfStudent,
    date: currentDate,
  };
}

/**
 * Number of calls made by the {@link setDeliverablesName()} function
 */
let calls = 0;

/**
 * Function that sets the new value for the liverable names
 *
 * @param timeout Amount of milliseconds
 */
function setDeliverablesName(timeout) {
  setTimeout(() => {
    const MAX_CALLSTACK_EXCEEDED = calls > 10;
    if (MAX_CALLSTACK_EXCEEDED) {
      console.log(
        "%cMax calling stack exceeded (10 calls MAX), the script will stop to avoid infinite loops, please reload the page",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      return;
    }
    /**
     * All the `<aside>` in the page
     */
    const arrayOfAsides = selectQueryAll(
      `aside[data-claire-semantic='information']`
    );

    //We get the correct one
    const liverablesAside = arrayOfAsides.filter((aside) => {
      const isLiverableAside = aside.textContent.includes("Dupont_Jean");
      if (isLiverableAside) {
        return aside;
      }
    })?.[0];

    const WANTED_ASIDE_NOT_FOUND = !liverablesAside;

    if (WANTED_ASIDE_NOT_FOUND) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve the correct aside element! Calling the function back again in 500ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 500; //Timeout in milliseconds
      calls++;
      return setDeliverablesName(newTimeout);
    }

    //p
    let titleOfLiverables = selectQuery("strong>em", liverablesAside);

    //ul
    let listForLiverables = selectQueryAll("ul>li", liverablesAside);

    log(titleOfLiverables, listForLiverables);

    /**
     * All the useful infos
     */
    const { formattedTitle, formattedName, date } = getAllUsefulInfos();

    const INFOS_ARE_MISSING = !formattedTitle || !formattedName || !date;

    if (INFOS_ARE_MISSING) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve all the useful informations of the project! Calling the function back again in 500ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 500; //Timeout in milliseconds
      calls++;
      return setDeliverablesName(newTimeout);
    }

    console.log(
      "%cSuccessfully retrieved all the useful infos!",
      "padding:5px; font-size: 24px; background: darkblue; color:white;"
    );
    log({ formattedTitle }, { formattedName }, { date });

    //We change the name of the title inside the aside element
    titleOfLiverables.textContent = formattedTitle;

    //We change the name of the variables
    for (item of listForLiverables) {
      //We replace the name
      let nameOfItem = item.textContent;
      item.textContent = replaceText(nameOfItem, "Nom_Prénom", formattedName);

      //We replace teh date
      nameOfItem = item.textContent;
      item.textContent = replaceText(nameOfItem, "mmaaaa", date);

      //We make the text italic
      item.style.fontStyle = "italic";
    }
    console.log(
      "%cThe script worked!",
      "padding:5px; font-size: 24px; background: green; color:white;"
    );
  }, timeout);
}

let currentTimeout = 3_000; //In milliseconds

setDeliverablesName(currentTimeout);
