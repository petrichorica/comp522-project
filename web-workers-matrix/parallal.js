"use strict";

// Size of the matrix
const n = 4;
const maxInt = 10;

// Create SharedArrayBuffers for matrices A and B
const size = n * n;
const sabA = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
const sabB = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
const sabC = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);

// Create typed arrays over the SharedArrayBuffers
const A = new Int32Array(sabA);
const B = new Int32Array(sabB);
const C = new Int32Array(sabC);

// Initialize A and B with random integer values
for (let i = 0; i < size; i++) {
  A[i] = Math.floor(Math.random() * maxInt);
  B[i] = Math.floor(Math.random() * maxInt);
}

// Sequential matrix multiplication function
function sequentialMatrixMultiply(A, B, n) {
  const C = new Int32Array(n * n);
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
function parallelMatrixMultiply(A, B, C, n, numWorkers, callback) {
  let completedRows = 0;

  // Create a queue of row indices
  const rowQueue = [];
  for (let i = 0; i < n; i++) {
    rowQueue.push(i);
  }

  // Function to assign a row to a worker
  function assignRow(worker) {
    if (rowQueue.length > 0) {
      const i = rowQueue.shift();
      // Send data to the worker
      worker.postMessage({
        sabA: A.buffer,
        sabB: B.buffer,
        sabC: C.buffer,
        n: n,
        i: i,
      });
    } else {
      // No more rows, terminate the worker
      worker.terminate();
    }
  }

  // Function to handle messages from workers
  function handleWorkerMessage(event) {
    completedRows++;
    if (completedRows === n) {
      // All rows are completed
      callback(C);
    } else {
      // Assign a new row to the worker
      assignRow(event.target);
    }
  }

  // Create workers and start assigning rows
  for (let w = 0; w < numWorkers; w++) {
    const worker = new Worker("worker.js");

    // Listen for messages from the worker
    worker.onmessage = handleWorkerMessage;

    // Assign initial row to the worker
    assignRow(worker);
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


// Function to compare two matrices
function compareResults(seqResult, parResult, n) {
  const epsilon = 1e-6; // Tolerance for floating-point comparison
  for (let i = 0; i < n * n; i++) {
    if (Math.abs(seqResult[i] - parResult[i]) > epsilon) {
      console.error(
        `Difference at index ${i}: sequentialResult[${i}] = ${seqResult[i]}, parallelResult[${i}] = ${parResult[i]}`
      );
      return false;
    }
  }
  return true;
}

parallelMatrixMultiply(A, B, C, n, numWorkers, function (parallelResult) {
  const parallelEndTime = performance.now();
  const parallelTime = parallelEndTime - parallelStartTime;
  console.log(
    `Parallel execution time with ${numWorkers} workers: ${parallelTime.toFixed(
      3
    )} milliseconds`
  );

  // Compare the results
  const resultsAreEqual = compareResults(sequentialResult, parallelResult, n);
  if (resultsAreEqual) {
    console.log("Sequential and parallel results are equal.");
  } else {
    console.log("Sequential and parallel results are NOT equal.");
  }
});