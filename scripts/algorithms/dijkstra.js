import { enableButtons } from "../index.js";

export function dijkstraAlgorithm(grid, startNode, endNode, speed) {
  const distanceMap = new Map();
  for (const node of grid) {
    distanceMap.set(node, Infinity);
  }

  distanceMap.set(startNode, 0);

  const unvisitedNodes = new Set(grid);

  const visitedNodes = new Set();

  const previousNodes = new Map();
  let reachedEndNode = false;
  const loop = () => {
    if (!reachedEndNode) {
      let currentNode = null;
      let smallestDistance = Infinity;
      for (const [node, distance] of distanceMap) {
        if (unvisitedNodes.has(node) && distance < smallestDistance) {
          currentNode = node;
          smallestDistance = distance;
        }
      }
      visitedNodes.add(currentNode);

      unvisitedNodes.delete(currentNode);

      if (!currentNode.classList.contains("shortest-path")) {
        currentNode.classList.add("visited-node", "animate");
      }

      if (currentNode === endNode) {
        reachedEndNode = true;
      }

      for (const neighbor of getNeighboringNodes(currentNode)) {
        if (visitedNodes.has(neighbor)) {
          continue;
        }
        const distance =
          distanceMap.get(currentNode) + getDistance(currentNode, neighbor);

        if (distance < distanceMap.get(neighbor)) {
          distanceMap.set(neighbor, distance);
          previousNodes.set(neighbor, currentNode);
        }
      }

      setTimeout(loop, speed);
    } else {
      const shortestPath = [];

      let currentNode = endNode;

      while (currentNode) {
        shortestPath.unshift(currentNode);
        currentNode = previousNodes.get(currentNode);
      }

      let i = 0;
      const animateShortestPath = () => {
        if (i < shortestPath.length) {
          shortestPath[i].classList.add("shortest-path", "animate");
          shortestPath[i].classList.remove("visited-node");
          i++;
          setTimeout(animateShortestPath, speed + 25);
        }
      };

      animateShortestPath();

      enableButtons();
    }
  };
  loop();
}

function getNeighboringNodes(node) {
  const neighboringNodes = [];

  const row = parseInt(node.dataset.row);
  const col = parseInt(node.dataset.col);

  if (col > 0) {
    neighboringNodes.push(node.parentElement.children[col - 1]);
  }

  if (col < node.parentElement.children.length - 1) {
    neighboringNodes.push(node.parentElement.children[col + 1]);
  }

  if (row > 0) {
    neighboringNodes.push(
      node.parentElement.parentElement.children[row - 1].children[col]
    );
  }

  if (row < node.parentElement.parentElement.children.length - 1) {
    neighboringNodes.push(
      node.parentElement.parentElement.children[row + 1].children[col]
    );
  }

  return neighboringNodes.filter(
    (neighbor) => !neighbor.classList.contains("wall")
  );
}

function getDistance(node1, node2) {
  if (
    node1.dataset.row !== node2.dataset.row &&
    node1.dataset.col !== node2.dataset.col
  ) {
    return 1.4;
  }

  return 1;
}
