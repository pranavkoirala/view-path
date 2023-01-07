import {
  createNodeRow,
  createNodeColumn,
  createEndPointRow,
  createEndPointColumn,
} from "./index.js";
import { grid } from "./grid.js";

const djAlgorithm = () => {
  // Initialize distances and previous objects
  const distances = {};
  const previous = {};
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      const coordinates = `${column},${row}`;
      if (column === createNodeColumn && row === createNodeRow) {
        distances[coordinates] = 0;
      } else {
        distances[coordinates] = Infinity;
      }
      previous[coordinates] = null;
    }
  }

  // Initialize visited and unvisited sets
  const visited = new Set();
  const unvisited = new Set();
  for (const coordinates in distances) {
    unvisited.add(coordinates);
  }

  // Loop until all nodes have been visited
  while (unvisited.size > 0) {
    // Select the unvisited node with the smallest distance
    let currentNode;
    let smallestDistance = Infinity;
    for (const coordinates of unvisited) {
      if (distances[coordinates] < smallestDistance) {
        currentNode = coordinates;
        smallestDistance = distances[coordinates];
      }
    }

    // Mark the current node as visited
    unvisited.delete(currentNode);
    visited.add(currentNode);

    // Split the current node coordinates into separate variables
    console.log(currentNode);
    const currentColumn = parseInt(currentNode.split(",")[0]);
    const currentRow = parseInt(currentNode.split(",")[1]);

    // Get neighbors of the current node
    const neighbors = getNeighbors(currentColumn, currentRow);

    // Update distances and previous values for neighbors
    for (const neighbor of neighbors) {
      const distance = distances[currentNode] + 1;
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = currentNode;
      }
    }
  }

  // Trace back the shortest path from the end node to the start node
  let shortestPath = [];
  let currentNode = `${createEndPointColumn},${createEndPointRow}`;
  while (currentNode !== `${createNodeColumn},${createNodeRow}`) {
    shortestPath.push(currentNode);
    currentNode = previous[currentNode];
  }
  shortestPath.push(`${createNodeColumn},${createNodeRow}`);
  shortestPath.reverse();

  return shortestPath;
};

// Helper function to get the neighbors of a node
const getNeighbors = (column, row) => {
  const neighbors = [];
  if (column > 0 && !grid[column - 1][row]) {
    neighbors.push(`${column - 1},${row}`);
  }
  if (column < grid.length - 1 && !grid[column + 1][row]) {
    neighbors.push(`${column + 1},${row}`);
  }
  if (row > 0 && !grid[column][row - 1]) {
    neighbors.push(`${column},${row - 1}`);
  }
  if (row < grid[column].length - 1 && !grid[column][row + 1]) {
    neighbors.push(`${column},${row + 1}`);
  }
  return neighbors;
};

export default djAlgorithm;
