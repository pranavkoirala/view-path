import { gridElement } from "./grid.js";
import { mouseMove } from "./index.js";
export let createNodeOn = false;
let createNodeColumn;
let createNodeRow;
export let createEndPointOn = false;
let createEndPointColumn;
let createEndPointRow;

export function toggleCreateNode() {
  createNodeOn = !createNodeOn;
  if (createNodeOn) {
    document.addEventListener("mousemove", mouseMove);
  } else {
    document.removeEventListener("mousemove", mouseMove);
  }
}

export function updateCreateNode() {
  if (createNodeColumn !== null && createNodeRow !== null) {
    const gridItemElement = gridElement.querySelector(
      `[data-column="${createNodeColumn}"][data-row="${createNodeRow}"]`
    );
    gridItemElement.classList.add("aqua");
  } else {
    const gridItemElements = gridElement.querySelectorAll(".aqua");
    for (const gridItemElement of gridItemElements) {
      gridItemElement.classList.remove("aqua");
    }
  }
}

export function updateCreateEndPoint() {
  if (createEndPointColumn !== null && createEndPointRow !== null) {
    const gridItemElement = gridElement.querySelector(
      `[data-column="${createEndPointColumn}"][data-row="${createEndPointRow}"]`
    );
    gridItemElement.classList.add("purple");
  } else {
    const gridItemElements = gridElement.querySelectorAll(".purple");
    for (const gridItemElement of gridItemElements) {
      gridItemElement.classList.remove("purple");
    }
  }
}

export function toggleCreateEndPoint() {
  createEndPointOn = !createEndPointOn;
  if (createEndPointOn) {
    document.addEventListener("mousemove", mouseMove);
  } else {
    document.removeEventListener("mousemove", mouseMove);
  }
}
