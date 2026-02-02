// Problem Description – Priority Task Queue with Dynamic Concurrency

// You are required to implement a task queue that executes asynchronous tasks based on priority. 
// Higher-priority tasks should be executed before lower-priority ones. 
// The queue must enforce a concurrency limit, ensuring only a fixed number of tasks run at the same time, and allow this limit to be updated dynamically while the system is running.
class DynamicPriorityQueue {
  constructor(concurrency) {
    this.limit = Math.max(0, concurrency || 0);
    this.running = 0;
    this.queue = [];
    this._seq = 0;
  }

  setLimit(newLimit) {
    this.limit = Math.max(0, newLimit || 0);
    this._drain();
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        priority,
        seq: this._seq++,
        resolve,
        reject,
      });
      this._drain();
    });
  }

  _drain() {
    while (this.running < this.limit && this.queue.length > 0) {
      this.queue.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.seq - b.seq;
      });
      const next = this.queue.shift();
      this.running++;
      Promise.resolve()
        .then(() => next.task())
        .then((result) => next.resolve(result))
        .catch((err) => next.reject(err))
        .finally(() => {
          this.running--;
          this._drain();
        });
    }
  }
}

module.exports = DynamicPriorityQueue;
