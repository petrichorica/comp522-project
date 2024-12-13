const numWorkers = 4
const numElements = 20
const segmentSize = numElements / numWorkers
const sab = new SharedArrayBuffer(numElements * 4)
const typedArray = new Float32Array(sab)
for (let i = 0; i < numElements; i++) {
  typedArray[i] = i
}

const workers = []

for (let i = 0; i < numWorkers; i++) {
  const worker = new Worker('worker.js')
  worker.postMessage({ index: i, data: typedArray, segmentSize })
  workers.push(worker)
}

let completedWorkers = 0

workers.forEach((worker, index) => {
  worker.onmessage = function(event) {
    completedWorkers++
    if (completedWorkers === numWorkers) {
      console.log("all workers completed")
      console.log(typedArray)
    }
  }
})

