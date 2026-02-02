// Problem Description – Task Execution with Dependencies

// You are given a set of asynchronous tasks where some tasks depend on the completion of others. 
// Your goal is to execute each task only after all of its dependencies have been successfully fulfilled. 
// The solution should ensure correct execution order and handle dependency relationships properly
async function runWithDependencies(tasks) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const inFlight = new Map();

  const execute = (id, stack) => {
    if (inFlight.has(id)) return inFlight.get(id);
    if (stack.has(id)) {
      return Promise.reject(new Error("Circular Dependency Detected"));
    }
    const task = taskMap.get(id);
    if (!task) {
      return Promise.reject(new Error(`Missing Dependency: ${id}`));
    }
    const nextStack = new Set(stack);
    nextStack.add(id);
    const deps = task.deps || [];
    const promise = Promise.all(deps.map((dep) => execute(dep, nextStack))).then(
      () => task.run(),
    );
    inFlight.set(id, promise);
    return promise;
  };

  const results = await Promise.all(
    tasks.map((task) => execute(task.id, new Set())),
  );
  return results;
}

module.exports = runWithDependencies;
