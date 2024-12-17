// Listen for messages from the main thread
self.onmessage = function (event) {
  const { sabA, sabB, sabC, n, i } = event.data;

  // Reconstruct typed arrays from SharedArrayBuffers
  const A = new Int32Array(sabA);
  const B = new Int32Array(sabB);
  const C = new Int32Array(sabC);

  // Calculate the entire row i of the result matrix
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += A[i * n + k] * B[k * n + j];
    }
    C[i * n + j] = sum;
  }

  // Notify the main thread that the computation of the row is done
  self.postMessage({});
};