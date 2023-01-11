import { enableButtons } from "../index.js";

export function dfs(grid, startNode, endNode, speed) {
  const visitedNodes = new Set();
  const stack = [startNode];
  visitedNodes.add(startNode);

  const previousNodes = new Map();
  let reachedEndNode = false;

  const loop = () => {
    if (!reachedEndNode) {
      const currentNode = stack.pop();

      if (currentNode === endNode) {
        reachedEndNode = true;
      }

      for (const neighbor of getNeighboringNodes(currentNode, visitedNodes)) {
        if (!visitedNodes.has(neighbor)) {
          visitedNodes.add(neighbor);
          previousNodes.set(neighbor, currentNode);
          stack.push(neighbor);
        }
      }

      if (!currentNode.classList.contains("shortest-path")) {
        currentNode.classList.add("visited-node", "animate");
      }

      setTimeout(loop, speed);
    } else {
      const shortestPath = [];

      let currentNode = endNode;

      console.log(visitedNodes);
      while (currentNode !== startNode) {
        shortestPath.unshift(currentNode);
        currentNode = previousNodes.get(currentNode, visitedNodes);
        if (currentNode === startNode) {
          break;
        }
      }

      let i = 0;
      const animateShortestPath = () => {
        startNode.classList.add("shortest-path", "animate");
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

function getNeighboringNodes(node, visitedNodes) {
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
  console.log(visitedNodes);
  return neighboringNodes.filter(
    (neighbor) =>
      !neighbor.classList.contains("wall") && !visitedNodes.has(neighbor)
  );
}
