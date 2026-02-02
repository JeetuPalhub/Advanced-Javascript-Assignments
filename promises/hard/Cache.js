// Problem Description – Concurrent Cache with Deduplication and TTL
//
// You are required to implement a cache for async data fetching.
//
// The cache must:
// 1. Deduplicate concurrent requests for the same key
// 2. Cache resolved values with a time-to-live (TTL)
// 3. Return cached values if they are still valid
//
// If a cached value is close to expiry, return the current value
// but trigger a background refresh for future requests.
class Cache {
  constructor(ttl) {
    this.ttl = ttl;
    this.store = new Map();
  }

  get(key, fetcher) {
    const now = Date.now();
    const entry = this.store.get(key);

    if (entry) {
      if (entry.value !== undefined && entry.expiresAt > now) {
        const remaining = entry.expiresAt - now;
        if (remaining <= this.ttl * 0.1 && !entry.inFlight) {
          entry.inFlight = Promise.resolve()
            .then(() => fetcher())
            .then((value) => {
              entry.value = value;
              entry.expiresAt = Date.now() + this.ttl;
              entry.inFlight = null;
              return value;
            })
            .catch(() => {
              entry.inFlight = null;
            });
        }
        return Promise.resolve(entry.value);
      }
      if (entry.inFlight) {
        return entry.inFlight;
      }
    }

    const inFlight = Promise.resolve()
      .then(() => fetcher())
      .then((value) => {
        this.store.set(key, {
          value,
          expiresAt: Date.now() + this.ttl,
          inFlight: null,
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
    });

    return inFlight;
  }
}

  module.exports = Cache;
