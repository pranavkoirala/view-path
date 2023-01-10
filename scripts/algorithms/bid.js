import { enableButtons } from "../index.js";

export function bidirectional(startNode, endNode, speed) {
  const visitedNodesStart = new Set();
  const queueStart = [startNode];
  visitedNodesStart.add(startNode);

  const visitedNodesEnd = new Set();
  const queueEnd = [endNode];
  visitedNodesEnd.add(endNode);

  const previousNodesStart = new Map();
  const previousNodesEnd = new Map();
  let reachedIntersection = false;
  let intersectionNode = null;

  const loop = () => {
    if (!reachedIntersection) {
      const currentNodeStart = queueStart.shift();
      const currentNodeEnd = queueEnd.shift();

      if (visitedNodesEnd.has(currentNodeStart)) {
        reachedIntersection = true;
        intersectionNode = currentNodeStart;
      }

      if (visitedNodesStart.has(currentNodeEnd)) {
        reachedIntersection = true;
        intersectionNode = currentNodeEnd;
      }

      for (const neighbor of getNeighboringNodes(currentNodeStart)) {
        if (!visitedNodesStart.has(neighbor)) {
          visitedNodesStart.add(neighbor);
          previousNodesStart.set(neighbor, currentNodeStart);
          queueStart.push(neighbor);
        }
      }

      for (const neighbor of getNeighboringNodes(currentNodeEnd)) {
        if (!visitedNodesEnd.has(neighbor)) {
          visitedNodesEnd.add(neighbor);
          previousNodesEnd.set(neighbor, currentNodeEnd);
          queueEnd.push(neighbor);
        }
      }
      if (!currentNodeStart.classList.contains("shortest-path")) {
        currentNodeStart.classList.add("visited-node", "animate");
      }

      if (!currentNodeEnd.classList.contains("shortest-path")) {
        currentNodeEnd.classList.add("visited-node", "animate");
      }

      setTimeout(loop, speed);
    } else {
      const shortestPath = [];
      let currentNode = intersectionNode;
      while (currentNode) {
        shortestPath.unshift(currentNode);
        currentNode = previousNodesStart.get(currentNode);
      }
      currentNode = previousNodesEnd.get(intersectionNode);
      while (currentNode) {
        shortestPath.push(currentNode);
        currentNode = previousNodesEnd.get(currentNode);
      }
      let i = 0;
      const animateShortestPath = () => {
        if (i < shortestPath.length) {
          shortestPath[i].classList.add("shortest-path", "animate");
          shortestPath[i].classList.remove("visited-node");
          i++;
          setTimeout(animateShortestPath, speed + 50);
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
