class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    return this.items.shift();
  }

  top() {
    return this.items[0];
  }

  display() {
    console.log("Queue:", this.items);
  }
}

module.exports = Queue;
