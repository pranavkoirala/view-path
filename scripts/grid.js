export const grid = [];
export const gridElement = document.querySelector(".grid");

export function updateGrid(column, row, className) {
  const gridItemElement = gridElement.querySelector(
    `[data-column="${column}"][data-row="${row}"]`
  );
  if (grid[column][row]) {
    gridItemElement.classList.add("gray");
  } else {
    gridItemElement.classList.remove("gray");
  }
  if (className) {
    gridItemElement.classList.add(className);
  }
}
