console.log(
  "%cExecuting script...",
  "padding:5px; font-size: 24px; background-color: darkblue; color:white;"
);

function getDate() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const date = `${currentMonth}${currentYear}`;

  return date;
}

function replaceText(stringOfText, textToBeReplaced, textToReplaceBy) {
  return stringOfText.replaceAll(textToBeReplaced, textToReplaceBy);
}

function getInnerText(HTMLElement) {
  if (!HTMLElement.innerText) {
    return "";
  }

  return HTMLElement.innerText;
}

function setDeliverablesName(timeout) {
  setTimeout(() => {
    const unorderedList = document.querySelector(
      `aside[data-claire-semantic="information"] > ul`
    );

    if (!unorderedList) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve the unordered list! Calling the function back again in 500ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 500; //The timeout is always in milliseconds
      return setDeliverablesName(newTimeout);
    }
    const listItems = Array.from(unorderedList.children);
    /*
      const unorderedList = document.querySelector("aside > ul");
      const listItems = Array.from(unorderedList.children);
    */

    console.log(
      "%cThe script is working",
      "padding:5px; font-size: 24px; background: green; color:white;"
    );

    const mainHeadingElement = document.querySelector("h1");

    let mainHeadingText = getInnerText(mainHeadingElement);

    if (!mainHeadingText) {
      console.log(
        "%cThe script DID NOT work, couldn't retrieve the title of the project! Calling the function back again in 100ms",
        "padding:5px; font-size: 24px; background-color: red; color:white;"
      );
      let newTimeout = 100; //The timeout is always in milliseconds
      return setDeliverablesName(newTimeout);
    }
    mainHeadingText = replaceText(mainHeadingText, " ", "_");

    const titleOfProjectInAsideElement = document.querySelector("p>strong>em");
    let textOfAside = getInnerText(titleOfProjectInAsideElement);

    const button = document.querySelector("[data-testid='mainHeaderAvatar']");
    button.click(); //We click the button to open it

    const nameOfStudentElement = document.querySelector("span>strong");

    let nameOfStudent = getInnerText(nameOfStudentElement);
    nameOfStudent = replaceText(nameOfStudent, " ", "_");

    const actualTitleOfProject = `${mainHeadingText}_${nameOfStudent.toLowerCase()}`;
    titleOfProjectInAsideElement.textContent = replaceText(
      textOfAside,
      textOfAside,
      actualTitleOfProject
    );

    const newDate = getDate();

    setTimeout(() => {
      button.click(); //We click it again to close it
    }, 10);

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      item.setAttribute("style", "font-style: italic");

      item.textContent = replaceText(
        item.textContent,
        "Nom_Prénom",
        nameOfStudent
      );
      item.textContent = replaceText(item.textContent, "mmaaaa", newDate);
    }
    console.log(
      "%cThe script worked!",
      "padding:5px; font-size: 24px; background: green; color:white;"
    );
  }, timeout);
}

let currentTimeout = 2_500; //In milliseconds

setDeliverablesName(currentTimeout);
window.addEventListener("", () => {});
