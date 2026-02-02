// Problem Description – Parallel Chunked Async Reducer

// You are required to process an array using a reducer function where the reduction happens in sequence, but the data fetching or processing for items is performed in parallel chunks. 
// Each chunk should be processed concurrently, then reduced before moving to the next chunk. 
// The final reduced result must be correct and deterministic.
async function asyncReduceLimited(array, limit, asyncProcessFn, reducer, initialValue) {
  let acc = initialValue;
  if (!array || array.length === 0) return acc;

  for (let i = 0; i < array.length; i += limit) {
    const chunk = array.slice(i, i + limit);
    const processed = await Promise.all(chunk.map((item) => asyncProcessFn(item)));
    for (const value of processed) {
      acc = reducer(acc, value);
    }
  }

  return acc;
}

module.exports = asyncReduceLimited;
