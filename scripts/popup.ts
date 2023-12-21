import { selectQuery, selectQueryAll } from "@utils/dom.helpers";

const form = selectQuery<HTMLFormElement>("form");

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const inputsArray = selectQueryAll<HTMLInputElement>("input");

  const inputValuesMap = new Map<string, string | Date>();
  for (const input of inputsArray) {
    inputValuesMap.set(input.id, input.value);
  }

  console.log(inputValuesMap);

  //    chrome.runtime.sendMessage({ type: 'formSubmission', data: formData });
});

console.log("Hello popup.ts", form);
