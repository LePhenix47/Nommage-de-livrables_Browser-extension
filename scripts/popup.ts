import { selectQuery, selectQueryAll } from "@utils/dom.helpers";
import { valuesToBeRetrieved } from "@utils/variables";

declare const chrome: any;
const form = selectQuery<HTMLFormElement>("form");
const inputsArray = selectQueryAll<HTMLInputElement>("input");

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  // Create an object to store the values
  const valuesToBeStored = {
    ndl_firstName: inputsArray[0].value,
    ndl_lastName: inputsArray[1].value,
    ndl_date: inputsArray[2].value,
  };

  // Save input values to chrome.storage.sync
  chrome.storage.sync.set(valuesToBeStored, () => {
    console.log("Values saved to chrome.storage.sync:", valuesToBeStored);
  });

  // Send a message to background.js to inform about the setValues action
  chrome.runtime.sendMessage({
    type: "setValues",
    data: valuesToBeStored,
  });
});
async function populateInputs(): Promise<void> {
  // Retrieve values from chrome.storage.sync and populate inputs
  for (let i = 0; i < valuesToBeRetrieved.length; i++) {
    const key = valuesToBeRetrieved[i];

    // Use chrome.storage.sync.get to retrieve data
    await chrome.storage.sync.get(key, (result) => {
      const savedValue = result[key];

      const input: HTMLInputElement = inputsArray[i];
      input.value = savedValue;
    });
  }
}

// Call populateInputs to load saved values on page load
populateInputs();

console.log("Hello popup.ts", form);
