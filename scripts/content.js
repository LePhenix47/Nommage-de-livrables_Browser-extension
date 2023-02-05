/**
 * `console.log()` but with a simpler syntax
 *
 * @param  {...any} messages Dev messages to log to the console
 * @returns void
 */
function log(...messages) {
  return console.log(messages);
}

console.log(
  "%cExecuting script...",
  "padding:5px; font-size: 24px; background-color: darkblue; color:white;"
);

/**
 * Gets the current date in this format: *mmYYYY*
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
  if (!container) {
    return document.querySelector(query);
  }
  return container.querySelector(query);
}

/**
 * A simplified version of `document.querySelectorAll()`
 *
 * @param  query HTML Element to select
 * @param  container HTML Element to select the query from
 * @returns An array with all the elements selected *or* `null` if the element doesn't exist
 */
function selectQueryAll(query, container) {
  if (!container) {
    return Array.from(document.querySelectorAll(query));
  }
  return Array.from(container.querySelectorAll(query));
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
      title: null,
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

  //We click the button again to close it
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
    title: actualTitleOfProject,
    formattedName: formattedNameOfStudent,
    date: currentDate,
  };
}

let calls = 0;
/**
 * Function that sets the new value for the liverable names
 *
 * @param timeout Amount of milliseconds
 */
function setDeliverablesName(timeout) {
  setTimeout(() => {
    const arrayOfAsides = selectQueryAll(
      `aside[data-claire-semantic='information']`
    );

    const liverablesAside = arrayOfAsides.filter((aside) => {
      return aside.textContent.includes("Dupont_Jean");
    });

    console.log({ liverablesAside });

    if (calls >= 10) {
      console.log(
        "%cMax calling stack exceeded, the script will stop to avoid infinite loops, please reload the page",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      return;
    }

    if (!liverablesAside) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve the <aside> element! Calling the function back again in 500ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 500; //The timeout is always in milliseconds
      calls++;
      return setDeliverablesName(newTimeout);
    }

    console.log(
      "%cThe script is executing",
      "padding:5px; font-size: 24px; background: blue; color:white;"
    );

    /**
     * All the useful infos
     */
    const { title, formattedName, date } = getAllUsefulInfos();

    const infosAreMissing = !title || !formattedName || !date;

    if (infosAreMissing) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve all the useful informations of the project! Calling the function back again in 100ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 500; //The timeout is always in milliseconds
      calls++;
      return setDeliverablesName(newTimeout);
    } else {
      console.log(
        "%cSuccessfully retrieved all the useful infos!",
        "padding:5px; font-size: 24px; background: darkblue; color:white;"
      );
      log(title, formattedName, date);
    }

    console.log(
      "%cThe script worked!",
      "padding:5px; font-size: 24px; background: green; color:white;"
    );
  }, timeout);
}

let currentTimeout = 3_000; //In milliseconds

setDeliverablesName(currentTimeout);
