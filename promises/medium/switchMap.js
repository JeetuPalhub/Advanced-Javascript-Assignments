// Problem Description – switchMap(apiCall)

// You are required to implement a utility function named switchMap to handle rapidly triggered asynchronous requests, such as those from a search input.
// When multiple calls are made in quick succession, only the result of the most recent call should be used. 
// If an earlier request resolves after a later one, its result must be ignored

function switchMap(apiCall) {
    let lastToken = 0;
  
    return async (...args) => {
      const token = ++lastToken;
      try {
        const result = await apiCall(...args);
        if (token !== lastToken) return undefined;
        return result;
      } catch (err) {
        if (token !== lastToken) return undefined;
        throw err;
      }
    };
  }
  
  module.exports = switchMap;
