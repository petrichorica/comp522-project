// Function to calculate a single element of the result matrix
function calculateElement(A, B, i, j) {
  const n = A.length;
  let sum = 0;
  for (let k = 0; k < n; k++) {
    sum += A[i][k] * B[k][j];
  }
  return sum;
}

// Listen for messages from the main thread
self.onmessage = function(event) {
  const { A, B, i, j } = event.data;

  // Calculate the element at position (i, j)
  const result = calculateElement(A, B, i, j);

  // Send the result back to the main thread
  self.postMessage({ i, j, value: result });
};