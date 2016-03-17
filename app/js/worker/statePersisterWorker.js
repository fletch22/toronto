import { MessageTypes } from './message';
import DomlessAjax from '../service/domlessAjax';

const Queue = function () {
  const self = this;

  const queue = [];

  function processQueue() {
    if (queue.isPaused) {
      setTimeout(processQueue, 1);
      return;
    }

    let processing = [];
    processing.push(queue.shift());

    queue.isPaused = true;
    DomlessAjax.load('http://localhost:8080/vancouver/api/ping', JSON.stringify({ data: processing[0] }), (xhr) => {
      const result = xhr.responseText;
      console.log(result);
      postMessage("done.");
      queue.isPaused = false;
    });
  }

  self.isPaused = false;
  self.push = function push(data) {
    queue.push(data);
    processQueue();
  };
};

const queue = new Queue();

addEventListener('message', (event) => {
  console.log(`Worker received this data: ${event.data}`);

  const message = event.data;
  switch (message.type) {
    case MessageTypes.PersistMessage: {
      queue.push(message.body);
      break;
    }
    case MessageTypes.PauseQueue: {
      queue.isPaused = true;
      break;
    }
    default: {
      const error = { error: 'Could not determine type of worker message.' };
      throw error;
    }
  }

  postMessage(message);
}, false);

