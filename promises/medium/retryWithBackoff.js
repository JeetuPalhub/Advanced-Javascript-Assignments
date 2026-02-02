// Problem Description – retryWithBackoff(fn, retries, delay)

// You are required to write a function named retryWithBackoff that attempts to execute an asynchronous function fn. 
// If the execution fails, the function should wait for a specified delay in milliseconds before retrying. 
// This retry process should continue until the function succeeds or the maximum number of retries is reached.
async function retryWithBackoff(fn, retries, delay) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
      attempt++;
    }
  }
}

module.exports = retryWithBackoff;
