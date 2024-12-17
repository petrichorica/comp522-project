"use strict";

// Size of the matrix
let n = 500;
const maxInt = 10;

let numWorkers = 2; // Customize the number of workers

// Create SharedArrayBuffers for matrices A and B
const size = n * n;
const sabA = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
const sabB = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);
const sabC = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * size);

// Create typed arrays over the SharedArrayBuffers
const A = new Int32Array(sabA);
const B = new Int32Array(sabB);
const C_sequential = new Int32Array(n * n);
const C_parallel = new Int32Array(sabC);

// Add event listeners to the size and numWorkers select elements
document.getElementById("size").addEventListener("change", (event) => {
  n = parseInt(event.target.value);
});
document.getElementById("numWorkers").addEventListener("change", (event) => {
  numWorkers = parseInt(event.target.value);
});

// Sequential matrix multiplication function
function sequentialMatrixMultiply(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i * n + k] * B[k * n + j];
      }
      C_sequential[i * n + j] = sum;
    }
  }
}

// Parallel matrix multiplication function
function parallelMatrixMultiply(n, numWorkers, callback) {
  let completedWorkers = 0;
  const workers = [];

  // Function to assign a row to a worker
  function assignJob(worker, index) {
    worker.postMessage({
      A,
      B,
      C: C_parallel,
      index,
      numWorkers,
      n,
    });
  }

  // Function to handle messages from workers
  function handleWorkerMessage(event) {
    if (event.data === "done") {
      completedWorkers++;
    }
    if (completedWorkers === numWorkers) {
      for (const worker of workers) {
        worker.terminate();
      }
      callback();
    }
  }
  
  // Create workers and start assigning rows
  for (let w = 0; w < numWorkers; w++) {
    const worker = new Worker("worker.js");
    workers.push(worker);
    
    // Listen for messages from the worker
    worker.onmessage = handleWorkerMessage;
    
    // Assign initial row to the worker
    assignJob(worker, w);
  }
}


// Function to compare two matrices
function compareResults(n) {
  const epsilon = 1e-6; // Tolerance for floating-point comparison
  for (let i = 0; i < n * n; i++) {
    if (Math.abs(C_sequential[i] - C_parallel[i]) > epsilon) {
      console.error(
        `Difference at index ${i}: sequentialResult[${i}] = ${C_sequential[i]}, parallelResult[${i}] = ${C_parallel[i]}`
      );
      return false;
    }
  }
  return true;
}

document.getElementById("btnStart").addEventListener("click", () => {
  // Initialize A and B with random integer values
  for (let i = 0; i < size; i++) {
    A[i] = Math.floor(Math.random() * maxInt);
    B[i] = Math.floor(Math.random() * maxInt);
  }

  // Measure execution time for sequential multiplication
  const sequentialStartTime = performance.now();
  sequentialMatrixMultiply(n);
  const sequentialEndTime = performance.now();
  const sequentialTime = sequentialEndTime - sequentialStartTime;
  console.log(
    `Sequential execution time: ${sequentialTime.toFixed(3)} milliseconds`
  );

  // Measure execution time for parallel multiplication
  const parallelStartTime = performance.now();

  parallelMatrixMultiply(n, numWorkers, function () {
    const parallelEndTime = performance.now();
    const parallelTime = parallelEndTime - parallelStartTime;
    console.log(
      `Parallel execution time with ${numWorkers} workers: ${parallelTime.toFixed(
        3
      )} milliseconds`
    );

    const speedup = sequentialTime / parallelTime;
    console.log("n: ", n);
    console.log("numWorkers: ", numWorkers);
    console.log(`Speedup: ${speedup.toFixed(2)}`);

    // Compare the results
    const resultsAreEqual = compareResults(n);
    if (resultsAreEqual) {
      console.log("Sequential and parallel results are equal.");
    } else {
      console.log("Sequential and parallel results are NOT equal.");
    }
  });
});