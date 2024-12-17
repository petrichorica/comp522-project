// Listen for messages from the main thread
self.onmessage = function (event) {
  const { A, B, C, n, index, numWorkers } = event.data;

  let segmentSize = Math.floor(n / numWorkers);
  if (segmentSize * numWorkers < n) {
    segmentSize++;
  }

  // console.log("index: ", index);
  // console.log("segmentSize: ", segmentSize);
  // console.log("start: ", index * segmentSize);
  // console.log("end: ", Math.min((index + 1) * segmentSize, n));

  // Calculate the entire row i of the result matrix
  for (let i = index * segmentSize; i < (index + 1) * segmentSize && i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i * n + k] * B[k * n + j];
      }
      C[i * n + j] = sum;
    }
  }

  // Notify the main thread that the computation of the row is done
  self.postMessage("done");
};