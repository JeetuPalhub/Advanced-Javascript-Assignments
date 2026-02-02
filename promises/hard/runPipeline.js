// Problem Description – Abortable Async Pipeline
//
// You are required to implement an async pipeline that executes
// an array of async functions sequentially (waterfall execution).
//
// The pipeline must support cancellation using AbortController.
// If the abort signal is triggered:
// 1. Execution must stop immediately
// 2. Any pending async operation should be aborted
// 3. The pipeline must throw an AbortError
//
// This pattern is commonly used in fetch pipelines and job orchestration.
async function runPipeline(fns, signal) {
  const createAbortError = () => {
    const err = new Error("Abort");
    err.name = "AbortError";
    return err;
  };

  if (signal?.aborted) {
    throw createAbortError();
  }

  const abortPromise =
    signal &&
    new Promise((_, reject) => {
      signal.addEventListener(
        "abort",
        () => {
          reject(createAbortError());
        },
        { once: true },
      );
    });

  for (const fn of fns) {
    if (signal?.aborted) {
      throw createAbortError();
    }
    const taskPromise = Promise.resolve().then(() => fn());
    if (abortPromise) {
      await Promise.race([taskPromise, abortPromise]);
    } else {
      await taskPromise;
    }
  }
}

  module.exports =  runPipeline ;
  
