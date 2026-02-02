// Problem Description – Request Batcher
//
// You are required to implement a batcher that groups multiple requests
// within a short time window into a single bulk request.
//
// Requirements:
// 1. Requests added within the batch window must be sent together
// 2. Each caller must receive only its own result
// 3. Only one network call should be made per batch window

function createBatcher(fetchBulk, delayMs = 50) {
  let timer = null;
  let pending = new Map();

  const flush = async () => {
    const batch = pending;
    pending = new Map();
    timer = null;

    const ids = Array.from(batch.keys());
    try {
      const results = await fetchBulk(ids);
      ids.forEach((id) => {
        const handlers = batch.get(id) || [];
        handlers.forEach(({ resolve }) => resolve(results[id]));
      });
    } catch (err) {
      ids.forEach((id) => {
        const handlers = batch.get(id) || [];
        handlers.forEach(({ reject }) => reject(err));
      });
    }
  };

  return function add(id) {
    return new Promise((resolve, reject) => {
      if (!pending.has(id)) pending.set(id, []);
      pending.get(id).push({ resolve, reject });

      if (!timer) {
        timer = setTimeout(flush, delayMs);
      }
    });
  };
}
module.exports = createBatcher;
