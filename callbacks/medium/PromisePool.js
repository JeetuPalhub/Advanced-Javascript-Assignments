// Problem Description – Asynchronous Worker Pool

// You are required to create a worker pool that manages the execution of asynchronous tasks. 
// The pool should ensure that no more than N tasks are running concurrently, while any additional tasks are queued. 
// As tasks complete, queued tasks should start automatically.
// Each task must resolve with its own result.

class PromisePool {
  constructor(limit) {
    this.limit = Math.max(1, limit || 1);
    this.running = 0;
    this.queue = [];
  }

  run(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._drain();
    });
  }

  _drain() {
    while (this.running < this.limit && this.queue.length > 0) {
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

module.exports = PromisePool;
