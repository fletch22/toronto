import uuid from 'node-uuid';

export const WorkerMessageTypes = {
  PersistMessageGuaranteedResponse: 'PersistMessageGuaranteedResponse',
  PersistMessageNoGuaranteedResponse: 'PersistMessageNoGuaranteedResponse',
  PersistMessageResponseSuccess: 'PersistMessageResponseSuccess',
  PersistMessageResponseFailure: 'PersistMessageResponseFailure',
  PauseQueue: 'PauseQueue',
  IsPaused: 'IsPaused',
  UnpauseQueue: 'UnpauseQueue',
  PauseAndClear: 'PauseAndClear',
  BlockadeAndDrain: 'BlockadeAndDrain',
  Unblockade: 'Unblockade',
  QueueEmpty: 'QueueEmpty',
  QueueDrainedAndWaiting: 'QueueDrainedAndWaiting',
  StateRollback: 'StateRollback'
};

class WorkerMessage {
  constructor(messageBody, type, id) {
    this.body = messageBody;
    this.type = type;
    this.id = (id === 'undefined') ? uuid.v1() : id;
  }
}

export default WorkerMessage;
