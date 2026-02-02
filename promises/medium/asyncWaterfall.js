// Problem Description – Chained Async Function Execution

// You are required to implement a function that accepts an array of asynchronous functions. 
// Each function should be executed only after the previous one has completed, and it should receive the resolved result of the previous function as its input. 
// The final output should be the result of the last function in the chain.
async function asyncWaterfall(tasks, initialValue) {
  let result = initialValue;
  for (const task of tasks) {
    result = await task(result);
  }
  return result;
}

module.exports = asyncWaterfall;
