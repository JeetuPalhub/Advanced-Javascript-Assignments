// Problem Description – Async Initialization Gate

// You are required to design a mechanism for APIs that depend on an asynchronous initialization step. 
// Any calls made before initialization completes should wait and execute only after the initialization finishes. 
// Calls made after initialization should run immediately without waiting.
class GuardedAPI {
  constructor(initPromise) {
    this._initFailed = false;
    this._initSettled = Promise.resolve(initPromise)
      .then(() => {})
      .catch((err) => {
        this._initFailed = true;
        this._initError = err;
      });
  }

  async call(fn) {
    await this._initSettled;
    if (this._initFailed) {
      throw new Error("Initialization failed");
    }
    return fn();
  }
}

module.exports = GuardedAPI;
