onmessage = function (event) {
  console.log(`Worker received this data: ${event.data}`);
  postMessage(event.data);
};

