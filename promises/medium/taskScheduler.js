// Problem Description – Concurrency-Limited Task Executor

// You are given an array of asynchronous tasks and a number maxConcurrent. 
// Your task is to execute the tasks while ensuring that no more than maxConcurrent tasks run at the same time. 
// As soon as one task completes, the next pending task should start. 
// The final output must preserve the original task order.
async function taskScheduler(tasks, maxConcurrent) {
  if (tasks.length === 0) return [];

  return new Promise((resolve, reject) => {
    const results = new Array(tasks.length);
    let inFlight = 0;
    let index = 0;
    let completed = 0;

    const launchNext = () => {
      while (inFlight < maxConcurrent && index < tasks.length) {
        const currentIndex = index++;
        inFlight++;
        Promise.resolve()
          .then(() => tasks[currentIndex]())
          .then((value) => {
            results[currentIndex] = value;
            inFlight--;
            completed++;
            if (completed === tasks.length) {
              resolve(results);
            } else {
              launchNext();
            }
          })
          .catch(reject);
      }
    };

    launchNext();
  });
}

module.exports = taskScheduler;
