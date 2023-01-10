export function aStarAlgorithm(grid, startNode, endNode, speed) {
  const distanceMap = new Map();
  const fScoreMap = new Map();
  for (const node of grid) {
    distanceMap.set(node, Infinity);
    fScoreMap.set(node, Infinity);
  }

  distanceMap.set(startNode, 0);

  const priorityQueue = new Heap(
    [startNode],
    (a, b) => fScoreMap.get(a) - fScoreMap.get(b)
  );
  fScoreMap.set(startNode, 0);

  const previousNodes = new Map();
  let reachedEndNode = false;

  const loop = () => {
    if (!reachedEndNode) {
      const currentNode = priorityQueue.extractRoot();

      if (currentNode === endNode) {
        reachedEndNode = true;
      }

      for (const neighbor of getNeighboringNodes(currentNode)) {
        const distance =
          distanceMap.get(currentNode) + getDistance(currentNode, neighbor);

        if (distance < distanceMap.get(neighbor)) {
          distanceMap.set(neighbor, distance);
          previousNodes.set(neighbor, currentNode);

          fScoreMap.set(
            neighbor,
            distance + getEuclideanDistance(neighbor, endNode)
          );
          priorityQueue.add(neighbor);
        }
      }

      currentNode.classList.add("visited-node", "animate");

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
          setTimeout(animateShortestPath, speed + 50);
        }
      };

      animateShortestPath();
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

function getEuclideanDistance(node1, node2) {
  const x1 = parseInt(node1.dataset.row);
  const y1 = parseInt(node1.dataset.col);
  const x2 = parseInt(node2.dataset.row);
  const y2 = parseInt(node2.dataset.col);

  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

class Heap {
  constructor(elements, comparator) {
    this.elements = elements;
    this.comparator = comparator;
    this.buildHeap();
  }

  buildHeap() {
    for (let i = Math.floor(this.elements.length / 2); i >= 0; i--) {
      this.heapifyDown(i);
    }
  }

  heapifyDown(i) {
    let minIndex = i;
    const leftChildIndex = 2 * i + 1;
    const rightChildIndex = 2 * i + 2;

    if (
      leftChildIndex < this.elements.length &&
      this.comparator(this.elements[leftChildIndex], this.elements[minIndex]) <
        0
    ) {
      minIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.elements.length &&
      this.comparator(this.elements[rightChildIndex], this.elements[minIndex]) <
        0
    ) {
      minIndex = rightChildIndex;
    }

    if (i !== minIndex) {
      [this.elements[i], this.elements[minIndex]] = [
        this.elements[minIndex],
        this.elements[i],
      ];
      this.heapifyDown(minIndex);
    }
  }

  heapifyUp(i) {
    let parentIndex = Math.floor((i - 1) / 2);

    while (
      i > 0 &&
      this.comparator(this.elements[i], this.elements[parentIndex]) < 0
    ) {
      [this.elements[i], this.elements[parentIndex]] = [
        this.elements[parentIndex],
        this.elements[i],
      ];
      i = parentIndex;
      parentIndex = Math.floor((i - 1) / 2);
    }
  }

  add(element) {
    this.elements.push(element);
    this.heapifyUp(this.elements.length - 1);
  }

  extractRoot() {
    if (this.elements.length === 0) return null;

    if (this.elements.length === 1) return this.elements.pop();

    const root = this.elements[0];
    this.elements[0] = this.elements.pop();
    this.heapifyDown(0);

    return root;
  }
}
