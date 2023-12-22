import { valuesToBeRetrieved } from "@utils/variables";

declare const chrome: any;

// Background script to handle communication between popup and content
chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "content-script");

  // Listen for messages from the popup
  port.onMessage.addListener((msg) => {
    if (msg.type === "setValues") {
      // Forward the message to content.js
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          type: "setValues",
          data: msg.data,
        });
      });
    }
  });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getValues") {
    const savedValues: Record<string, any> = {};

    // A function to check if all values are retrieved
    const checkAndSend = () => {
      if (Object.keys(savedValues).length === valuesToBeRetrieved.length) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {
            type: "sendValues",
            data: savedValues,
          });
        });
      }
    };

    // Loop through keys and retrieve values
    valuesToBeRetrieved.forEach((key) => {
      chrome.storage.sync.get(key, (result) => {
        savedValues[key] = result[key];
        checkAndSend(); // Check if all values are retrieved
      });
    });
  }
});

// Handle extension install or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    // Perform any necessary setup on install or update
    console.log("NDL Extension installed or updated");
  }
});
