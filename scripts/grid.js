export const grid = [];
export let gridElement = document.querySelector(".grid");

export function updateGridItem(column, row) {
  const gridItemElement = gridElement.querySelector(
    `[data-column="${column}"][data-row="${row}"]`
  );
  if (grid[column][row]) {
    gridItemElement.classList.add("gray");
  } else {
    gridItemElement.classList.remove("gray");
  }
}
