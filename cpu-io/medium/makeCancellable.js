
// Problem Description – Abortable Promise Wrapper

// You are required to wrap a Promise so that it can be cancelled using an AbortSignal.
// If the signal is aborted before the Promise settles, the wrapper should immediately reject with an appropriate error. 
// If not aborted, it should resolve or reject normally.

function makeCancellable(promise, signal) {
  if (signal?.aborted) {
    return Promise.reject(new Error("Aborted"));
  }

  return new Promise((resolve, reject) => {
    const onAbort = () => {
      reject(new Error("Aborted"));
    };

    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }

    Promise.resolve(promise)
      .then((value) => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        resolve(value);
      })
      .catch((err) => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        reject(err);
      });
  });
}

module.exports = makeCancellable;
