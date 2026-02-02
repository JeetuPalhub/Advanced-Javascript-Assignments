// Problem Description – Polyfill for Promise.allSettled

// You are required to implement a polyfill for Promise.allSettled. 
// The function should accept an array of Promises and wait for all of them to either resolve or reject.
// It must return a Promise that resolves with an array of result objects describing the status and value or reason of each Promise.
function promiseAllSettled(promises) {
  const wrapped = promises.map((p) =>
    Promise.resolve(p)
      .then((value) => ({ status: "fulfilled", value }))
      .catch((reason) => ({ status: "rejected", reason })),
  );
  return Promise.all(wrapped);
}

module.exports = promiseAllSettled;
