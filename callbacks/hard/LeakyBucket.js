// Problem Description – Leaky Bucket Rate Limiter
//
// You are required to implement a RateLimiter based on the Leaky Bucket algorithm.
//
// The rate limiter has a fixed capacity and processes tasks at a constant rate.
// Tasks are executed in the exact order they are received.
//
// Requirements:
// 1. The bucket has a maximum capacity
// 2. Tasks are processed at a fixed interval (leak rate)
// 3. If the bucket is full, new tasks must be rejected immediately
// 4. Fairness must be preserved (FIFO execution)

class LeakyBucket {
  constructor(capacity, leakRateMs) {
    this.capacity = capacity;
    this.leakRateMs = leakRateMs;
    this.queue = [];
    this.running = false;
    this.lastRunAt = 0;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const currentSize = this.queue.length + (this.running ? 1 : 0);
      if (currentSize >= this.capacity) {
        reject(new Error("Rate Limit Exceeded"));
        return;
      }
      this.queue.push({ task, resolve, reject });
      this._leak();
    });
  }

  async _leak() {
    if (this.running || this.queue.length === 0) return;
    this.running = true;

    const waitFor = Math.max(
      0,
      this.lastRunAt + this.leakRateMs - Date.now(),
    );
    if (waitFor > 0) {
      await new Promise((res) => setTimeout(res, waitFor));
    }

    const { task, resolve, reject } = this.queue.shift();
    this.lastRunAt = Date.now();

    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.running = false;
      if (this.queue.length > 0) {
        this._leak();
      }
    }
  }
}


module.exports = LeakyBucket;
