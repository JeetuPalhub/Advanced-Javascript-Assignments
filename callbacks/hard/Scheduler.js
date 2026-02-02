// Problem Description – Preemptive Priority Task Scheduler
//
// You are required to build a scheduler that executes async tasks
// based on priority.
//
// Higher-priority tasks should be executed before lower-priority ones.
// Long-running tasks must periodically yield control back to the scheduler
// so that newly arrived high-priority tasks can be processed.
//
// True preemption is not possible in JavaScript, so tasks must cooperate
// by yielding execution voluntarily.

class Scheduler {
  constructor() {
    this.queue = [];
    this._seq = 0;
  }

  schedule(task, priority = 0) {
    this.queue.push({ task, priority, seq: this._seq++ });
  }

  async run() {
    this.queue.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.seq - b.seq;
    });
    for (const item of this.queue) {
      await item.task();
    }
    this.queue = [];
  }
}

  
  module.exports = Scheduler;
