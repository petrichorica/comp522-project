"use strict";

// Size of the matrix
const n = 4;
const maxInt = 10; // Maximum integer value for random integers

// Initialize matrices A and B with random integer values
const A = [];
const B = [];
for (let i = 0; i < n; i++) {
  A[i] = [];
  B[i] = [];
  for (let j = 0; j < n; j++) {
    if (i==j) {
      A[i][j] = 1;
    }else{
      A[i][j] = 0;
    }
    B[i][j] = 2;
    // TODO: change to this
    // A[i][j] = Math.floor(Math.random() * maxInt);
    // B[i][j] = Math.floor(Math.random() * maxInt);
  }
}

// Sequential matrix multiplication function
function sequentialMatrixMultiply(A, B) {
  const n = A.length;
  const C = [];
  for (let i = 0; i < n; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

// Parallel matrix multiplication function
function parallelMatrixMultiply(A, B, numWorkers, callback) {
  const n = A.length;

  // Result matrix C
  const C = [];
  for (let i = 0; i < n; i++) {
    C[i] = new Array(n).fill(0);
  }

  let completedTasks = 0;
  const totalTasks = n * n;

  // Create a queue of tasks (i, j pairs)
  const taskQueue = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      taskQueue.push({ i, j });
    }
  }

  // Create a pool of workers
  const workers = [];

  // Function to assign a task to a worker
  function assignTask(worker) {
    if (taskQueue.length > 0) {
      const { i, j } = taskQueue.shift();
      // Send data to the worker
      worker.postMessage({
        A: A,
        B: B,
        i: i,
        j: j,
      });
    } else {
      // No more tasks, terminate the worker
      worker.terminate();
    }
  }

  // Function to handle messages from workers
  function handleWorkerMessage(event) {
    const { i, j, value } = event.data;
    console.log(`Worker completed task (${i}, ${j})`);

    // Store the computed value in the result matrix C
    C[i][j] = value;

    completedTasks++;
    if (completedTasks === totalTasks) {
      // All tasks are completed
      callback(C);
    } else {
      // Assign a new task to the worker
      assignTask(event.target);
    }
  }

  // Create workers and start assigning tasks
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker('worker.js');
    workers.push(worker);

    // Listen for messages from the worker
    worker.onmessage = handleWorkerMessage;

    // Assign initial task to the worker
    assignTask(worker);
  }
}

// Measure execution time for sequential multiplication
const sequentialStartTime = performance.now();
const sequentialResult = sequentialMatrixMultiply(A, B);
const sequentialEndTime = performance.now();
const sequentialTime = (sequentialEndTime - sequentialStartTime) / 1000;
console.log(`Sequential execution time: ${sequentialTime} seconds`);

// Measure execution time for parallel multiplication
const numWorkers = 4; // Customize the number of workers
const parallelStartTime = performance.now();

parallelMatrixMultiply(A, B, numWorkers, function (parallelResult) {
  const parallelEndTime = performance.now();
  const parallelTime = (parallelEndTime - parallelStartTime) / 1000;
  console.log(`Parallel execution time with ${numWorkers} workers: ${parallelTime} seconds`);

  // Optional: Compare results
  // console.log('Sequential Result:', sequentialResult);
  // console.log('Parallel Result:', parallelResult);
});