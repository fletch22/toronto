import workerClient from '../worker/statePersisterWorkerClient';

class StateFixer {

  fix(stateOld, stateNew) {
    workerClient.persistStateNoResponse(stateOld, stateNew);
  }

  resetStatePersister() {
    workerClient.resetPersister();
  }
}

export default new StateFixer();
