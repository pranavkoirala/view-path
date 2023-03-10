/* Imports */
import { dijkstraAlgorithm } from "./algorithms/dijkstra.js";
import { aStarAlgorithm } from "./algorithms/a_star.js";
import { bfs } from "./algorithms/bfs.js";
import { bidirectional } from "./algorithms/bid.js";
import { dfs } from "./algorithms/dfs.js";

/* Elements */
const gridContainer = document.querySelector(".grid-container");
const toggleWallsButton = document.querySelector("#toggle-walls-button");
const clearWallsButton = document.querySelector("#clear-walls-button");
const startNodeButton = document.getElementById("start-node-button");
const endNodeButton = document.getElementById("end-node-button");
const startAlgorithmButton = document.querySelector("#start-algorithm-button");
const clearGridButton = document.querySelector("#clear-grid-button");
const selectedSpeed = document.getElementById("speeds");
const keepPreviousGridButton = document.querySelector(".keep-previous-grid");
const selectedAlgorithm = document.getElementById("algorithms");
const targetSvg = document.getElementById("my-target");
const startSvg = document.getElementById("my-start");
startNodeButton.disabled = false;
endNodeButton.disabled = false;
startAlgorithmButton.disabled = false;
document.ondragstart = function () {
  return false;
};

let toggleWalls = true;
let isMouseDown = false;
let startingNodeToggled = false;
let endingNodeToggled = false;
let tutorialFinished = false;
let keepPreviousGrid = false;

// /* Tutorial */
// document.onload = tutorial();
// function tutorial() {
//   gridContainer.style.zIndex = "-1";
//   selectedSpeed.style.zIndex = "-1";
//   selectedAlgorithm.style.zIndex = "-1";
// }

/* After Tutorial */
for (let row = 0; row < 43; row++) {
  const gridRow = document.createElement("div");
  gridRow.classList.add("grid-row");
  for (let col = 0; col < 103; col++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.dataset.row = row;
    gridItem.dataset.col = col;
    gridRow.appendChild(gridItem);
  }
  gridContainer.appendChild(gridRow);
}

toggleWallsButton.addEventListener("click", () => {
  toggleWalls = !toggleWalls;
  toggleWallsButton.innerHTML = `Toggle Walls: ${toggleWalls}`;
});

keepPreviousGridButton.addEventListener("click", () => {
  keepPreviousGrid = !keepPreviousGrid;
  keepPreviousGridButton.innerHTML = `Keep Grid: ${keepPreviousGrid}`;
});

gridContainer.addEventListener("mousedown", (e) => {
  isMouseDown = true;
});

gridContainer.addEventListener("mousemove", (event) => {
  if (
    isMouseDown &&
    !event.target.classList.contains("starting-node") &&
    !event.target.classList.contains("ending-node") &&
    !startingNodeToggled &&
    !endingNodeToggled
  ) {
    if (event.target.classList.contains("grid-item")) {
      if (toggleWalls) {
        event.target.classList.add("wall");
      } else {
        event.target.classList.remove("wall");
      }
    }
  }
});
let startNode = null;
let endNode = null;

gridContainer.addEventListener("mouseup", () => {
  isMouseDown = false;
});

clearWallsButton.addEventListener("click", () => {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((gridItem) => {
    gridItem.classList.remove("wall");
  });
});

clearGridButton.addEventListener("click", () => {
  if (startSvg) startSvg.parentNode.removeChild(startSvg);
  if (targetSvg) targetSvg.parentNode.removeChild(targetSvg);
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((gridItem) => {
    gridItem.classList.remove(
      "wall",
      "visited-node",
      "shortest-path",
      "start-node",
      "end-node"
    );
  });
  startNode = null;
  endNode = null;
});

startNodeButton.addEventListener("click", (event) => {
  endNodeButton.classList.remove("active");
  startNodeButton.classList.add("active");
});

endNodeButton.addEventListener("click", (event) => {
  startNodeButton.classList.remove("active");
  endNodeButton.classList.add("active");
});

gridContainer.addEventListener("click", (event) => {
  const clickedItem = event.target;

  if (clickedItem.classList.contains("grid-item")) {
    if (startNodeButton.classList.contains("active")) {
      startNodeButton.classList.remove("active");
      if (startNode) {
        startNode.classList.remove("start-node");
      }
      startNode = clickedItem;
      addStartSVG(startNode);
      startNode.classList.add("start-node");
    } else if (endNodeButton.classList.contains("active")) {
      endNodeButton.classList.remove("active");
      if (endNode) {
        endNode.classList.remove("end-node");
      }
      endNode = clickedItem;
      addEndSVG(endNode);
      endNode.classList.add("end-node");
    }
  }
});

startAlgorithmButton.addEventListener("click", () => {
  startNodeButton.disabled = true;
  endNodeButton.disabled = true;
  startAlgorithmButton.disabled = true;
  if (!keepPreviousGrid) {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((gridItem) => {
      gridItem.classList.remove("visited-node", "shortest-path");
    });
  }
  const selectedSpeedValue = selectedSpeed.value;
  const selectedAlgorithmValue = selectedAlgorithm.value;
  let speed = 0;
  switch (selectedSpeedValue) {
    case "fast":
      speed = 50;
      break;
    case "medium":
      speed = 150;
      break;
    case "slow":
      speed = 250;
      break;
    case "sloth":
      speed = 350;
      break;
    default:
      speed = 0;
  }

  if (startNode && endNode) {
    if (startNode.classList.contains("wall")) {
      startNode.classList.remove("wall");
    }
    if (endNode.classList.contains("wall")) {
      endNode.classList.remove("wall");
    }
    const grid = Array.from(document.querySelectorAll(".grid-item"));
    switch (selectedAlgorithmValue) {
      case "dijkstra-algorithm":
        dijkstraAlgorithm(grid, startNode, endNode, speed);
        break;
      case "a-star-algorithm":
        aStarAlgorithm(grid, startNode, endNode, speed);
        break;
      case "bfs-algorithm":
        bfs(grid, startNode, endNode, speed);
        break;
      case "bid-algorithm":
        bidirectional(startNode, endNode, speed);
        break;
      case "dfs-algorithm":
        dfs(grid, startNode, endNode, speed);
        break;
      // case "bellman-algorithm":
      //   break;
      // case "floyd-algorithm":
      //   break;
    }
  } else {
    alert("Please place a start node and an end node.");
  }
});

function addStartSVG(startNode) {
  startNode.appendChild(startSvg);
}

function addEndSVG(endNode) {
  endNode.appendChild(targetSvg);
}

export function enableButtons() {
  startNodeButton.disabled = false;
  endNodeButton.disabled = false;
  startAlgorithmButton.disabled = false;
}
