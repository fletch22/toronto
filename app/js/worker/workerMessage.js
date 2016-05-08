import uuid from 'node-uuid';

export const WorkerMessageTypes = {
  PersistMessageGuaranteedResponse: 'PersistMessageGuaranteedResponse',
  PersistMessageNoGuaranteedResponse: 'PersistMessageNoGuaranteedResponse',
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
  self.id = uuid.v1();
};

export default WorkerMessage;