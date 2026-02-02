// Problem Description – Block Event Loop
//
// In Node.js, long-running synchronous operations block the event loop,
// preventing other tasks (like timers or I/O) from executing.
//
// Your task is to implement a function `blockEventLoop(ms)` that
// synchronously blocks the execution for the given duration.
//
// Requirements:
// 1. Do NOT use `setTimeout` or Promises (those are non-blocking).
// 2. Use a `while` loop with `Date.now()` or `performance.now()`.
// 3. This is a teaching tool to show how NOT to write async code.

function blockEventLoop(ms) {
  const now =
    typeof performance !== "undefined" && performance.now
      ? () => performance.now()
      : () => Date.now();
  const start = now();
  while (now() - start < ms) {}
}

module.exports = blockEventLoop;
