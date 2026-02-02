
// Problem Description – Recursive Fetch with Redirect Handling

// You are required to fetch data for a given set of IDs. 
// Each response may contain a redirectId, indicating that the data should be fetched again using the new ID. 
// The process must continue until the final data is reached. 
// Your implementation should also detect and prevent infinite redirect loops.

async function fetchDeep(ids, fetcher, maxDepth = 5) {
  const entries = Object.entries(ids);

  const fetchOne = async (startId) => {
    let currentId = startId;
    for (let depth = 0; depth < maxDepth; depth++) {
      const data = await fetcher(currentId);
      if (!data || !data.redirectId) return data;
      currentId = data.redirectId;
    }
    throw new Error("Max redirect depth exceeded");
  };

  const results = await Promise.all(
    entries.map(async ([key, id]) => [key, await fetchOne(id)]),
  );

  return Object.fromEntries(results);
}

module.exports = fetchDeep;
