self.onmessage = function(event) {
  const { index, data, segmentSize } = event.data
  console.group('[worker thread]')
  console.log("data received")
  console.groupEnd()

  // update the array
  for (let i = index * segmentSize; i < (index + 1) * segmentSize; i++) {
    data[i] = Math.sqrt(data[i])
  }

  // send the updated array back to the main thread
  self.postMessage("updated")
};

