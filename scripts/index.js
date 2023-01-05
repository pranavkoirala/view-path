// TODO: fix dji algorithm freezing my browser

import { grid, gridElement, updateGridItem } from "./grid.js";
import { dijkstra } from "./dj-algorithm.js";
import {
  toggleCreateEndPoint,
  toggleCreateNode,
  createEndPointOn,
  createNodeOn,
} from "./points.js";

let createEndPointRow;
let createNodeColumn;
let createNodeRow;
let createEndPointColumn;
let previousGridItem;
let previousGridPurple;
let startNodeColumn;
let startNodeRow;
let endNodeColumn;
let endNodeRow;
document.ondragstart = function () {
  return false;
};

let wallsOn = true;
/* buttons */
const startAlgorithmButton = document.getElementById("start-algorithm");
const button = document.getElementById("walls-toggle");
const createNodeButton = document.getElementById("create-node");
const createEndPointButton = document.getElementById("create-end-point");

/* Event Listeners */
button.addEventListener("click", toggleWalls);
createNodeButton.addEventListener("click", toggleCreateNode);
createEndPointButton.addEventListener("click", toggleCreateEndPoint);
startAlgorithmButton.addEventListener("click", () => {
  if (!createNodeColumn || !createEndPointColumn) {
    alert("Please set both a start and end node before running the algorithm");
  } else {
    startNodeColumn = createNodeColumn;
    startNodeRow = createNodeRow;
    endNodeColumn = createEndPointColumn;
    endNodeRow = createEndPointRow;
    console.log("btn clicked and working");
    const shortestPath = dijkstra();
    for (const [column, row] of shortestPath) {
      updateGridItem(column, row, "shortest-path");
    }
  }
});

for (let column = 0; column < 61; column++) {
  grid[column] = [];
  for (let row = 0; row < 31; row++) {
    grid[column][row] = false;
    const gridItemElement = document.createElement("div");
    gridItemElement.classList.add("grid-item");
    gridItemElement.dataset.column = column;
    gridItemElement.dataset.row = row;
    gridElement.appendChild(gridItemElement);
    gridItemElement.addEventListener("mousedown", () => {
      if (createNodeOn) {
        createNodeColumn = column;
        createNodeRow = row;
        toggleCreateNode();
      } else if (createEndPointOn) {
        createEndPointColumn = column;
        createEndPointRow = row;
        toggleCreateEndPoint();
      } else {
        grid[column][row] = !grid[column][row];
        updateGridItem(column, row);
        document.addEventListener("mousemove", mouseMove);
      }
    });
    gridItemElement.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", mouseMove);
    });
  }
}
function toggleWalls() {
  wallsOn = !wallsOn;
  const toggleWallsButton = document.getElementById("walls-toggle");
  toggleWallsButton.innerText = `Toggle Walls: ${wallsOn}`;
}

function mouseMove(event) {
  const gridItemElement = event.target;
  const column = gridItemElement.dataset.column;
  const row = gridItemElement.dataset.row;
  if (createNodeOn) {
    if (
      column < 0 ||
      column >= grid.length ||
      row < 0 ||
      row >= grid[column].length ||
      gridItemElement.classList.contains("gray") ||
      gridItemElement.classList.contains("purple")
    ) {
      return;
    }
    if (previousGridItem) {
      previousGridItem.classList.remove("aqua");
    }
    previousGridItem = gridItemElement;
    createNodeColumn = column;
    createNodeRow = row;
    gridItemElement.classList.add("aqua");
  } else if (createEndPointOn) {
    if (
      column < 0 ||
      column >= grid.length ||
      row < 0 ||
      row >= grid[column].length ||
      gridItemElement.classList.contains("gray") ||
      gridItemElement.classList.contains("aqua")
    ) {
      return;
    }
    if (previousGridPurple) {
      previousGridPurple.classList.remove("purple");
    }
    previousGridPurple = gridItemElement;
    createEndPointColumn = column;
    createEndPointRow = row;
    gridItemElement.classList.add("purple");
  } else {
    if (
      gridItemElement.classList.contains("aqua") ||
      gridItemElement.classList.contains("purple")
    ) {
      return;
    }
    if (wallsOn) {
      if (!grid[column][row]) {
        grid[column][row] = true;
        updateGridItem(column, row);
      }
    } else {
      if (grid[column][row]) {
        grid[column][row] = false;
        updateGridItem(column, row);
      }
    }
  }
}

const gridItemElement = document.createElement("div");
gridItemElement.addEventListener("mousedown", () => {
  if (createNodeOn) {
    createNodeColumn = column;
    createNodeRow = row;
    toggleCreateNode();
  } else if (createEndPointOn) {
    createEndPointColumn = column;
    createEndPointRow = row;
    toggleCreateEndPoint();
  } else {
    grid[column][row] = !grid[column][row];
    updateGridItem(column, row);
    document.addEventListener("mousemove", mouseMove);
  }
});
gridItemElement.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", mouseMove);
});

export { mouseMove, startNodeColumn, startNodeRow, endNodeColumn, endNodeRow };
