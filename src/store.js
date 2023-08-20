import { writable } from "svelte/store";

const items = JSON.parse(window.localStorage.getItem("cache") || "{}");
export const cache = writable(items);

cache.subscribe((val) =>
  window.localStorage.setItem("cache", JSON.stringify(val)),
);
