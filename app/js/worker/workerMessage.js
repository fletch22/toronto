export const WorkerMessageTypes = {
  PersistMessage: 'PersistMessage',
  PauseQueue: 'PauseQueue',
  IsPaused: 'IsPaused',
  UnpauseQueue: 'UnpauseQueue',
  PauseAndClear: 'PauseAndClear',
  PauseAndDrain: 'PauseAndDrain'
};

const WorkerMessage = function(messageBody, type) {
  const self = this;

  self.body = messageBody;
  self.type = type;
};

export default WorkerMessage;
