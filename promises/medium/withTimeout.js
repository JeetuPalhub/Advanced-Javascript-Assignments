// Problem Description – withTimeout(promise, ms)

// You are required to create a wrapper function named withTimeout that takes a Promise and a time limit in milliseconds. 
// The function should return a new Promise that settles with the same result as the original Promise if it completes within the given time. 
// If the Promise does not settle within the time limit, it should reject with the message "Timeout".
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);

    Promise.resolve(promise)
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

module.exports = withTimeout;
