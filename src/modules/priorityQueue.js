class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(priority, value) {
    const newItem = { priority, value };
    this.items.push(newItem);
    this.bubbleUp(this.items.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    if (this.items.length === 1) {
      return this.items.pop();
    }
    const root = this.items[0];
    this.items[0] = this.items.pop();
    this.bubbleDown(0);
    return root;
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  bubbleUp(index) {
    const item = this.items[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentItem = this.items[parentIndex];
      if (item.priority >= parentItem.priority) {
        break;
      }
      this.items[index] = parentItem;
      index = parentIndex;
    }
    this.items[index] = item;
  }

  bubbleDown(index) {
    const length = this.items.length;
    const item = this.items[index];

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = null;

      if (leftChildIndex < length) {
        const leftChild = this.items[leftChildIndex];
        if (leftChild.priority < item.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.items[rightChildIndex];
        if (
          (swapIndex === null && rightChild.priority < item.priority) ||
          (swapIndex !== null &&
            rightChild.priority < this.items[swapIndex].priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) {
        break;
      }

      this.items[index] = this.items[swapIndex];
      index = swapIndex;
    }

    this.items[index] = item;
  }
}

export { PriorityQueue };
