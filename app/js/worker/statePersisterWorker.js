import { MessageTypes } from './message';
import DomlessAjax from '../service/domlessAjax';

const Queue = function () {
  const self = this;

  const queue = [];

  function emitEventIfQueueEmpty() {
    if (queue.length === 0) {
      postMessage('Done.');
    }
  }

  function processQueue() {
    if (queue.isPaused) {
      setTimeout(processQueue, 1);
      return;
    }

    console.log(queue.length);
    let sendArray = null;
    if (queue.length === 0) {
      emitEventIfQueueEmpty();
      return;
    } else {
      sendArray = queue.splice(0, queue.length);
    }

    queue.isPaused = true;
    DomlessAjax.load('http://localhost:8080/vancouver/api/ping', JSON.stringify({ states: sendArray }), (xhr) => {
      const result = xhr.responseText;
      console.log(result);
      queue.isPaused = false;

      emitEventIfQueueEmpty();
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
}, false);

