// Problem Description – Custom Implementation of Promise.race

// You are required to implement your own version of Promise.race without using the built-in method. 
// The function should accept an iterable of values that may include Promises or plain values. 
// It must settle as soon as the first input settles, resolving or rejecting accordingly. 
// Using Promise.resolve ensures non-promise values are handled correctly.
function promiseRace(promises) {
  if (!Array.isArray(promises) || promises.length === 0) {
    return new Promise(() => {});
  }
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve).catch(reject);
    });
  });
}

module.exports = promiseRace;
