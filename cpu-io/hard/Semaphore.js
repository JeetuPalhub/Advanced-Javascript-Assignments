// Problem Description – Async Semaphore (Concurrency Guard)
//
// You are required to implement an async Semaphore that controls
// access to a limited resource.
//
// The semaphore has a fixed number of permits.
// Tasks must acquire a permit before executing and release it after finishing.
//
// Requirements:
// 1. Only N tasks may run concurrently
// 2. Excess tasks must wait (not reject)
// 3. Permits must be released even if a task throws
// 4. Execution order must be fair (FIFO)
//
// This pattern is widely used in databases, connection pools,
// and file system access control.

class Semaphore {
  constructor(max) {
    this.max = max;
    this.available = max;
    this.queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (this.available > 0) {
        this.available--;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.available++;
    }
  }

  async run(task) {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release();
    }
  }
}

  module.exports = Semaphore;
  
