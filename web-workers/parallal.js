// Create an array of data to process (e.g., numbers)
const data = Array.from({ length: 1000000 }, () => Math.random() * 100);

// Define the number of workers to use
const numWorkers = 4;
const segmentSize = Math.ceil(data.length / numWorkers);

// Array to hold references to worker instances
const workers = [];

// Function to handle messages from workers
function handleWorkerMessage(event) {
  const { index, result } = event.data;
  console.log(`Worker ${index} completed:`, result);

  // Store or process the result as needed
  // Example: Aggregate results, update UI, etc.
}

// Spawn multiple workers and assign tasks
for (var i = 0; i < numWorkers; i++) {
  const start = i * segmentSize;
  const end = start + segmentSize;
  const segmentData = data.slice(start, end);

  // Create a new worker and assign a task
  const worker = new Worker('worker.js');
  worker.postMessage({ index: i, data: segmentData });

  // Listen for messages from the worker
  worker.onmessage = handleWorkerMessage;

  // Store worker reference
  workers.push(worker);
}

// Function to handle completion of all workers
function handleAllWorkersCompleted() {
  console.log('All workers have completed their tasks.');
  // Perform final aggregation or cleanup here
}

// Track number of completed workers
var completedWorkers = 0;

// Listen for completion of each worker
workers.forEach((worker, index) => {
  worker.onmessage = function(event) {
    handleWorkerMessage(event);
    completedWorkers++;

    // Check if all workers have completed
    if (completedWorkers === numWorkers) {
      handleAllWorkersCompleted();
    }
  };
});