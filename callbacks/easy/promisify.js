// Problem Description – promisify(fn)

// You are required to write a function named promisify that takes a function following the callback pattern (error, data) => void. 
// The goal is to convert this function into one that returns a Promise. 
// The Promise should resolve with the data when no error occurs and reject when an error is provided.
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      try {
        fn(...args, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
}

module.exports = promisify;
