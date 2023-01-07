import { grid, gridElement, updateGrid } from "./grid.js";
import {
  toggleCreateEndPoint,
  toggleCreateNode,
  createEndPointOn,
  createNodeOn,
} from "./points.js";
import { dijkstra } from "./dj-algorithm.js";

let createEndPointRow;
let createNodeColumn;
let createNodeRow;
let createEndPointColumn;
let previousGridItem;
let previousGridPurple;
let startNodeColumn;
let startNodeRow;
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
startAlgorithmButton.addEventListener("click", async () => {
  console.log(
    createNodeColumn,
    createNodeRow,
    createEndPointColumn,
    createEndPointRow
  );
  const previous = await dijkstra(
    grid,
    createNodeColumn,
    createNodeRow,
    createEndPointColumn,
    createEndPointRow
  );
  // Remove previously highlighted nodes
  const highlightedNodes = document.querySelectorAll(".highlighted");
  highlightedNodes.forEach((node) => node.classList.remove("highlighted"));
  // Reconstruct shortest path
  let current = `${createEndPointColumn},${createEndPointRow}`;
  const path = [];
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }
  // Highlight current path
  path.forEach((node) => {
    const [column, row] = node.split(",");
    const gridItem = document.querySelector(
      `.grid-item[data-column="${column}"][data-row="${row}"]`
    );
    gridItem.classList.add("highlighted");
  });
});

class PriorityQueue {
  constructor(compare) {
    this.compare = compare;
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.heap[0];
  }

  enqueue(item) {
    this.heap.push(item);
    this._siftUp();
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._siftDown();
    return item;
  }

  _siftUp() {
    let index = this.size() - 1;
    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      if (this.compare(this.heap[index], this.heap[parentIndex])) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _siftDown() {
    let index = 0;
    while (index < this.size()) {
      const leftChildIndex = (index << 1) + 1;
      const rightChildIndex = (index << 1) + 2;
      let minIndex = index;
      if (
        leftChildIndex < this.size() &&
        this.compare(this.heap[leftChildIndex], this.heap[minIndex])
      ) {
        minIndex = leftChildIndex;
      }
      if (
        rightChildIndex < this.size() &&
        this.compare(this.heap[rightChildIndex], this.heap[minIndex])
      ) {
        minIndex = rightChildIndex;
      }
      if (minIndex !== index) {
        [this.heap[index], this.heap[minIndex]] = [
          this.heap[minIndex],
          this.heap[index],
        ];
        index = minIndex;
      } else {
        break;
      }
    }
  }
}

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
        updateGrid(column, row);
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
        updateGrid(column, row);
      }
    } else {
      if (grid[column][row]) {
        grid[column][row] = false;
        updateGrid(column, row);
      }
    }
  }
}

export {
  mouseMove,
  PriorityQueue,
  createNodeColumn,
  createNodeRow,
  createEndPointColumn,
  createEndPointRow,
};
