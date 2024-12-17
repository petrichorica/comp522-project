// Function to calculate a single element of the result matrix
function calculateElement(sharedA, sharedB, n, i, j) {
  let sum = 0;
  for (let k = 0; k < n; k++) {
    sum += sharedA[i * n + k] * sharedB[k * n + j];
  }
  return sum;
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  const { A, B, C, n, i, j } = event.data;

  // Calculate the element at position (i, j)
  const value = calculateElement(A, B, n, i, j);

  // Store the result in the shared result array
  C[i * n + j] = value;

  // Notify the main thread that the computation is done
  self.postMessage({});
};