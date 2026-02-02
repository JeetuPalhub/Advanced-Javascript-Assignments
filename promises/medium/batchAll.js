// Problem Description – batchAll(tasks, batchSize)

// You are required to implement a function named batchAll that processes an array of asynchronous tasks in fixed-size batches. 
// Each batch should execute its tasks concurrently, but the next batch must not start until all tasks in the current batch have completed.
async function batchAll(tasks, batchSize) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize).map((task) => task());
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
}

module.exports = batchAll;
