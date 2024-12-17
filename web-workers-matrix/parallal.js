"use strict";

// Size of the matrix
const n = 500;
const maxInt = 10;

// Create SharedArrayBuffers for matrices A and B
const size = n * n;
const sabA = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * size);
const sabB = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * size);

// Create typed arrays over the SharedArrayBuffers
const A = new Float32Array(sabA);
const B = new Float32Array(sabB);

// Initialize A and B with random integer values
for (let i = 0; i < size; i++) {
  A[i] = Math.floor(Math.random() * maxInt);
  B[i] = Math.floor(Math.random() * maxInt);
}

// Sequential matrix multiplication function
function sequentialMatrixMultiply(A, B, n) {
  const C = new Float32Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i * n + k] * B[k * n + j];
      }
      C[i * n + j] = sum;
    }
  }
  return C;
}

// Parallel matrix multiplication function
function parallelMatrixMultiply(A, B, n, numWorkers, callback) {
  // Create SharedArrayBuffer for the result matrix C
  const sabC = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * n * n);
  const sharedC = new Float32Array(sabC);

  let completedTasks = 0;
  const totalTasks = n * n;

  // Create a queue of tasks (i, j pairs)
  const taskQueue = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      taskQueue.push({ i, j });
    }
  }

  // Function to assign a task to a worker
  function assignTask(worker) {
    if (taskQueue.length > 0) {
      const { i, j } = taskQueue.shift();
      // Send data to the worker
      worker.postMessage(
        {
          A: A,
          B: B,
          C: sharedC,
          n: n,
          i: i,
          j: j,
        }
      );
    } else {
      // No more tasks, terminate the worker
      worker.terminate();
    }
  }

  // Function to handle messages from workers
  function handleWorkerMessage(event) {
    completedTasks++;
    if (completedTasks === totalTasks) {
      // All tasks are completed
      callback(sharedC);
    } else {
      // Assign a new task to the worker
      assignTask(event.target);
    }
  }

  // Create workers and start assigning tasks
  for (let w = 0; w < numWorkers; w++) {
    const worker = new Worker("worker.js");

    // Listen for messages from the worker
    worker.onmessage = handleWorkerMessage;

    // Assign initial task to the worker
    assignTask(worker);
  }
}

// Measure execution time for sequential multiplication
const sequentialStartTime = performance.now();
const sequentialResult = sequentialMatrixMultiply(A, B, n);
const sequentialEndTime = performance.now();
const sequentialTime = sequentialEndTime - sequentialStartTime;
console.log(
  `Sequential execution time: ${sequentialTime.toFixed(3)} milliseconds`
);

// Measure execution time for parallel multiplication
const numWorkers = 4; // Customize the number of workers
const parallelStartTime = performance.now();

parallelMatrixMultiply(A, B, n, numWorkers, function (parallelResult) {
  const parallelEndTime = performance.now();
  const parallelTime = parallelEndTime - parallelStartTime;
  console.log(
    `Parallel execution time with ${numWorkers} workers: ${parallelTime.toFixed(
      3
    )} milliseconds`
  );

  // Optional: Compare results
  // console.log('Sequential Result:', sequentialResult);
  // console.log('Parallel Result:', parallelResult);
});