let wallsOn = true;
let createNodeOn = false;
let createNodeColumn;
let createNodeRow;
let createEndPointOn = false;
let createEndPointColumn;
let createEndPointRow;

document.ondragstart = function () {
  return false;
};

const button = document.getElementById("walls-toggle");
button.addEventListener("click", toggleWalls);
const createNodeButton = document.getElementById("create-node");
createNodeButton.addEventListener("click", toggleCreateNode);
const createEndPointButton = document.getElementById("create-end-point");
createEndPointButton.addEventListener("click", toggleCreateEndPoint);
const grid = [];
const gridElement = document.querySelector(".grid");

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
      if (createEndPointOn) {
        createEndPointColumn = column;
        createEndPointRow = row;
        updateCreateEndPoint();
      } else if (createNodeOn) {
        createNodeColumn = column;
        createNodeRow = row;
        toggleCreateNode();
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

function mouseMove(event) {
  const gridItemElement = event.target;
  const column = gridItemElement.dataset.column;
  const row = gridItemElement.dataset.row;
  if (createEndPointOn) {
    createEndPointColumn = column;
    createEndPointRow = row;
    updateCreateEndPoint();
    return;
  }
  if (gridItemElement.classList.contains("aqua")) {
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

function toggleWalls() {
  wallsOn = !wallsOn;
  const toggleWallsButton = document.getElementById("walls-toggle");
  toggleWallsButton.innerText = `Toggle Walls: ${wallsOn}`;
}

function toggleCreateNode() {
  if (createEndPointOn) {
    toggleCreateEndPoint();
  }
  createNodeOn = !createNodeOn;
  if (createNodeOn) {
    createNodeColumn = null;
    createNodeRow = null;
  }
  updateCreateNode();
  const createNodeButton = document.getElementById("create-node");
  createNodeButton.innerText = `Create Node: ${createNodeOn}`;
}

function updateCreateNode() {
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

function updateGridItem(column, row) {
  const gridItemElement = gridElement.querySelector(
    `[data-column="${column}"][data-row="${row}"]`
  );
  if (grid[column][row]) {
    gridItemElement.classList.add("gray");
  } else {
    gridItemElement.classList.remove("gray");
  }
}

function updateCreateEndPoint() {
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

function toggleCreateEndPoint() {
  createEndPointOn = !createEndPointOn;
  if (createEndPointOn) {
    createEndPointColumn = null;
    createEndPointRow = null;
  }
  const createEndPointButton = document.getElementById("create-end-point");
  createEndPointButton.innerText = `Create Finish Node: ${createEndPointOn}`;
}
