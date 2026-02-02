// Problem Description – Custom Implementation of Promise.all

// You are required to implement your own version of Promise.all without using the built-in method. 
// The function should accept an array of values that may include Promises or plain constants. 
// It must resolve with an array of results in the same order once all inputs resolve, or reject immediately if any input rejects.
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new TypeError("Input must be an array"));
      return;
    }
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = value;
          remaining -= 1;
          if (remaining === 0) resolve(results);
        })
        .catch(reject);
    });
  });
}

module.exports = promiseAll;
