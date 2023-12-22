import { selectQuery, selectQueryAll } from "@utils/dom.helpers";
import WebStorageService from "@utils/web-storage.service";

const form = selectQuery<HTMLFormElement>("form");
const inputsArray = selectQueryAll<HTMLInputElement>("input");

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  for (const input of inputsArray) {
    WebStorageService.setKey(
      `ndl-extension_${input.id}`,
      input.type === "text" ? input.value : input.valueAsDate
    );
  }
  //    chrome.runtime.sendMessage({ type: 'formSubmission', data: formData });
});

function populateInputs(): void {
  const valuesToBeRetrieved = [
    "ndl-extension_first-name",
    "ndl-extension_last-name",
    "ndl-extension_date",
  ] as const;

  for (let i = 0; i < valuesToBeRetrieved.length; i++) {
    const savedValue: (typeof valuesToBeRetrieved)[number] =
      WebStorageService.getKey(valuesToBeRetrieved[i]);

    const input: HTMLInputElement = inputsArray[i];

    switch (input.type) {
      case "number": {
        input.valueAsNumber = Number(savedValue);
        break;
      }
      case "date": {
        input.valueAsDate = new Date(savedValue);
        break;
      }

      default:
        input.value = savedValue;
        break;
    }
  }
}
populateInputs();

console.log("Hello popup.ts", form);
