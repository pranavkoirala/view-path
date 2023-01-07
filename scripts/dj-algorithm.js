import { grid } from "./grid.js";
import {
  PriorityQueue,
  createNodeColumn,
  createNodeRow,
  createEndPointColumn,
  createEndPointRow,
} from "./index.js";

export async function dijkstra(
  grid,
  createNodeColumn,
  createNodeRow,
  createEndPointColumn,
  createEndPointRow
) {
  console.log(
    grid,
    createNodeColumn,
    createNodeRow,
    createEndPointColumn,
    createEndPointRow
  );
  console.log("dijkstra start");
  // Initialize distances and previous objects
  console.log("initializing distances and previous");
  const distances = {};
  const previous = {};
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      distances[`${column},${row}`] = Infinity;
      previous[`${column},${row}`] = undefined;
    }
  }
  distances[`${createNodeColumn},${createNodeRow}`] = 0;

  // Initialize priority queue and add all nodes to it
  console.log("initializing priority queue and adding all nodes");
  const q = new PriorityQueue((a, b) => a[1] < b[1]);
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      q.enqueue([`${column},${row}`, distances[`${column},${row}`]]);
    }
  }

  // Dijkstra's algorithm loop
  console.log("starting dijkstra loop");
  while (!q.isEmpty()) {
    console.log("iteration start");
    const [currentNode, currentDistance] = q.dequeue();
    const [currentColumn, currentRow] = currentNode.split(",");
    if (currentDistance === Infinity) break;

    // Check neighbors
    console.log("checking neighbors");
    const neighbors = [
      [parseInt(currentColumn) + 1, parseInt(currentRow)],
      [parseInt(currentColumn), parseInt(currentRow) + 1],
      [parseInt(currentColumn) - 1, parseInt(currentRow)],
      [parseInt(currentColumn), parseInt(currentRow) - 1],
    ];
    for (const neighbor of neighbors) {
      console.log(`visiting neighbor: ${neighbor}`);
      const [column, row] = neighbor;
      if (grid[column][row] === false) continue;
      const distance = currentDistance + 1;
      const node = `${column},${row}`;
      const element = document.querySelector(`[data-node="${node}"]`);
      console.log("ELEMENT: " + element);
      if (distance < distances[node]) {
        distances[node] = distance;
        previous[node] = currentNode;
        q.enqueue([node, distance]);
      }
    }
    // Delay the next iteration
    console.log("delaying next iteration");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Reconstruct shortest path
  console.log("reconstructing shortest path");
  const path = [];
  let current = `${createEndPointColumn},${createEndPointRow}`;
  while (current !== undefined) {
    console.log(path);
    console.log(`current: ${current}`);
    path.unshift(current);
    current = previous[current];
  }

  console.log("dijkstra end");
  return previous;
}
