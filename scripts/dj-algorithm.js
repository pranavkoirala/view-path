import { grid } from "./grid.js";
import {
  startNodeColumn,
  startNodeRow,
  endNodeColumn,
  endNodeRow,
} from "./index.js";

function getNeighbors(column, row) {
  // Returns the neighboring nodes of the given node
  const neighbors = [];
  if (column > 0) {
    neighbors.push([column - 1, row]);
  }
  if (column < grid.length - 1) {
    neighbors.push([column + 1, row]);
  }
  if (row > 0) {
    neighbors.push([column, row - 1]);
  }
  if (row < grid[column].length - 1) {
    neighbors.push([column, row + 1]);
  }
  return neighbors;
}

function dijkstra() {
  const visited = new Set();
  const distances = {};
  for (let column = 0; column < grid.length; column++) {
    for (let row = 0; row < grid[column].length; row++) {
      distances[[column, row]] = Infinity;
    }
  }
  distances[[startNodeColumn, startNodeRow]] = 0;

  while (visited.size < Object.keys(distances).length) {
    // Select the unvisited node with the smallest distance from the start node
    let currentNode = null;
    let currentDistance = Infinity;
    for (const [node, distance] of Object.entries(distances)) {
      if (!visited.has(node) && distance < currentDistance) {
        currentNode = node;
        currentDistance = distance;
      }
    }

    // Mark this node as visited
    visited.add(currentNode);

    // Update the distances of the neighbors
    const neighbors = getNeighbors(...currentNode.split(",").map(Number));
    for (const neighbor of neighbors) {
      const cost =
        distances[currentNode] + (grid[neighbor[0]][neighbor[1]] ? 1 : 0); // Add 1 to the cost if the neighbor is a wall
      if (cost < distances[neighbor]) {
        distances[neighbor] = cost;
      }
    }
  }

  // Find the shortest path by backtracking through the nodes
  let column = endNodeColumn;
  let row = endNodeRow;
  const shortestPath = [[column, row]];
  while (column !== startNodeColumn || row !== startNodeRow) {
    const neighbors = getNeighbors(column, row);
    let minDistance = Infinity;
    let minNeighbor = null;
    for (const neighbor of neighbors) {
      const distance = distances[neighbor];
      if (distance < minDistance) {
        minDistance = distance;
        minNeighbor = neighbor;
      }
    }
    column = minNeighbor[0];
    row = minNeighbor[1];
    shortestPath.unshift([column, row]);
  }

  // Return the shortest path
  return shortestPath;
}

const shortestPath = dijkstra();
