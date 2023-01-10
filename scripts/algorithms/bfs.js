import { enableButtons } from "../index.js";

export function bfs(grid, startNode, endNode, speed) {
  const visitedNodes = new Set();
  const queue = [startNode];

  const loop = () => {
    if (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode === endNode) {
        const shortestPath = getShortestPath(startNode, endNode, visitedNodes);
        animateShortestPath(shortestPath, speed, startNode);
        enableButtons();
        return;
      }

      visitedNodes.add(currentNode);

      if (!currentNode.classList.contains("shortest-path")) {
        currentNode.classList.add("visited-node", "animate");
      }

      const neighbors = getNeighboringNodes(currentNode);
      for (const neighbor of neighbors) {
        queue.push(neighbor);
      }

      setTimeout(loop, speed);
    }
  };

  loop();
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

  function getShortestPath(startNode, endNode, visitedNodes) {
    console.log("Entered getShortestPath");
    const shortestPath = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
      shortestPath.unshift(currentNode);
      currentNode = getPreviousNode(currentNode, visitedNodes);
      console.log(currentNode);
    }
    return shortestPath;
  }

  function getPreviousNode(node, visitedNodes) {
    const row = parseInt(node.dataset.row);
    const col = parseInt(node.dataset.col);
    if (col > 0 && visitedNodes.has(node.parentElement.children[col - 1])) {
      return node.parentElement.children[col - 1];
    }
    if (
      col < node.parentElement.children.length - 1 &&
      visitedNodes.has(node.parentElement.children[col + 1])
    ) {
      return node.parentElement.children[col + 1];
    }
    if (
      row > 0 &&
      visitedNodes.has(
        node.parentElement.parentElement.children[row - 1].children[col]
      )
    ) {
      return node.parentElement.parentElement.children[row - 1].children[col];
    }
    if (
      row < node.parentElement.parentElement.children.length - 1 &&
      visitedNodes.has(
        node.parentElement.parentElement.children[row + 1].children[col]
      )
    ) {
      return node.parentElement.parentElement.children[row + 1].children[col];
    }
    return null;
  }
  function animateShortestPath(shortestPath, speed, startNode) {
    let i = 0;
    startNode.classList.add("shortest-path", "animate");
    startNode.classList.remove("visited-node");
    const animate = () => {
      if (i < shortestPath.length) {
        shortestPath[i].classList.add("shortest-path", "animate");
        shortestPath[i].classList.remove("visited-node");
        i++;
        setTimeout(animate, speed + 50);
      }
    };
    animate();
  }
}
