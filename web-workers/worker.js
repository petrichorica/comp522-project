// Function to calculate statistics for a subset of data
function calculateStatistics(data) {
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / data.length;

  // Calculate median
  const sortedData = data.sort((a, b) => a - b);
  const median = sortedData.length % 2 === 0
    ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
    : sortedData[Math.floor(sortedData.length / 2)];

  // Calculate standard deviation
  const variance = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, stdDev };
}

// Listen for messages from the main thread
self.onmessage = function(event) {
  const { index, data } = event.data;

  // Perform calculations on the received data
  const result = calculateStatistics(data);

  // Send the result back to the main thread
  self.postMessage({ index, result });
};