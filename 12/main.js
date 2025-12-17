const Stack = require("./stack");
const Queue = require("./queue");

/* Stack operations */
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
stack.display();
console.log("Top of Stack:", stack.top());
stack.pop();
stack.display();

/* Queue operations */
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.display();
console.log("Front of Queue:", queue.top());
queue.dequeue();
queue.display();
