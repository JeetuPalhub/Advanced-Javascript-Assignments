// Problem Description – Asynchronous Map with Concurrency Limit

// You are required to implement an asynchronous version of Array.map that processes items using an async callback function. 
// Unlike the standard map, this version should only process a limited number of items concurrently. 
// As soon as one operation finishes, the next should begin.
// The final result must preserve the original order of the input array.
async function mapAsyncLimit(array, limit, asyncFn) {
  if (array.length === 0) return [];

  return new Promise((resolve, reject) => {
    const results = new Array(array.length);
    let inFlight = 0;
    let index = 0;
    let completed = 0;

    const launchNext = () => {
      while (inFlight < limit && index < array.length) {
        const currentIndex = index++;
        inFlight++;
        Promise.resolve()
          .then(() => asyncFn(array[currentIndex], currentIndex))
          .then((value) => {
            results[currentIndex] = value;
            inFlight--;
            completed++;
            if (completed === array.length) {
              resolve(results);
            } else {
              launchNext();
            }
          })
          .catch(reject);
      }
    };

    launchNext();
  });
}

module.exports = mapAsyncLimit;
