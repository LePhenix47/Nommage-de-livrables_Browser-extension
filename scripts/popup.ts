import { selectQuery, selectQueryAll } from "@utils/dom.helpers";

const form = selectQuery<HTMLFormElement>("form");

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  console.log(e);
});

console.log("Hello popup.ts", form);
