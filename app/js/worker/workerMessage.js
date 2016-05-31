import uuid from 'node-uuid';

export const WorkerMessageTypes = {
  PersistMessageGuaranteedResponse: 'PersistMessageGuaranteedResponse',
  PersistMessageNoGuaranteedResponse: 'PersistMessageNoGuaranteedResponse',
  PauseQueue: 'PauseQueue',
  UnpauseQueue: 'UnpauseQueue',
  PauseAndClear: 'PauseAndClear',
  ResetQueue: 'ResetQueue',
  BlockadeAndDrain: 'BlockadeAndDrain',
  Unblockade: 'Unblockade',
  QueueEmpty: 'QueueEmpty',
  StateRollback: 'StateRollback',
  Error: 'Error'
};

class WorkerMessage {
  constructor(messageBody, type, id) {
    this.body = messageBody;
    this.type = type;
    this.id = (id === 'undefined') ? uuid.v1() : id;
  }
}

export default WorkerMessage;
