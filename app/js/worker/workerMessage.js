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
  QUEUE_EMPTY: 'QUEUE_EMPTY',
  QUEUE_DRAINED_AND_WAITING: 'QUEUE_DRAINED_AND_WAITING',
  STATE_ROLLBACK: 'STATE_ROLLBACK'
};

class WorkerMessage {
  constructor(messageBody, type, id) {
    this.body = messageBody;
    this.type = type;
    this.id = (id === 'undefined') ? uuid.v1() : id;
  }
}

export default WorkerMessage;
