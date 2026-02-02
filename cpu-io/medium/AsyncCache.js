// Problem Description – Async Cache with Time-to-Live (TTL)

// You are required to create an asynchronous cache utility that exposes a get(key, fetcher) method. 
// If the requested key already exists in the cache, the cached value should be returned immediately. 
// If the key does not exist, the fetcher function should be executed to retrieve the value, 
// store it in the cache, and automatically remove the entry after a fixed Time-to-Live (TTL) of 5 seconds.
class AsyncCache {
  constructor(ttl = 5000) {
    this.ttl = ttl;
    this.store = new Map();
  }

  get(key, fetcher) {
    const now = Date.now();
    const entry = this.store.get(key);

    if (entry && entry.value !== undefined && entry.expiresAt > now) {
      return Promise.resolve(entry.value);
    }

    if (entry?.inFlight) {
      return entry.inFlight;
    }

    const inFlight = Promise.resolve()
      .then(() => fetcher())
      .then((value) => {
        const existing = this.store.get(key);
        if (existing?.timeoutId) {
          clearTimeout(existing.timeoutId);
        }
        const timeoutId = setTimeout(() => {
          const current = this.store.get(key);
          if (current && current.value === value) {
            this.store.delete(key);
          }
        }, this.ttl);

        this.store.set(key, {
          value,
          expiresAt: Date.now() + this.ttl,
          inFlight: null,
          timeoutId,
        });
        return value;
      })
      .catch((err) => {
        if (this.store.get(key)?.inFlight === inFlight) {
          this.store.delete(key);
        }
        throw err;
      });

    this.store.set(key, {
      value: undefined,
      expiresAt: 0,
      inFlight,
      timeoutId: null,
    });

    return inFlight;
  }
}

module.exports = AsyncCache;
