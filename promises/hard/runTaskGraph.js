// Problem Description – Dependency-Aware Task Scheduler
//
// You are required to write an async function that executes a set of tasks.
// Each task has a unique id, an async action, and a list of dependency task IDs.
//
// A task can only execute after all of its dependencies have completed.
// Tasks with no dependencies should start immediately and may run in parallel.
//
// The function must:
// 1. Execute tasks as soon as their dependencies are resolved
// 2. Detect circular dependencies and throw an error
// 3. Throw an error if a task depends on a missing task
//
// The function should return a map of taskId → result.

async function runTaskGraph(tasks) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));

  for (const task of tasks) {
    const deps = task.dependencies || [];
    for (const dep of deps) {
      if (!taskMap.has(dep)) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
  }

  const results = new Map();
  const inFlight = new Map();

  const execute = (id, stack) => {
    if (results.has(id)) return Promise.resolve(results.get(id));
    if (inFlight.has(id)) return inFlight.get(id);
    if (stack.has(id)) {
      return Promise.reject(new Error("Circular dependency detected"));
    }

    const task = taskMap.get(id);
    const nextStack = new Set(stack);
    nextStack.add(id);
    const deps = task.dependencies || [];

    const promise = Promise.all(deps.map((dep) => execute(dep, nextStack)))
      .then(() => task.action())
      .then((value) => {
        results.set(id, value);
        return value;
      });

    inFlight.set(id, promise);
    return promise;
  };

  await Promise.all([...taskMap.keys()].map((id) => execute(id, new Set())));
  return results;
}


module.exports = runTaskGraph;
