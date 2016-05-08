import timeTravelTransaction from './timeTravelTransaction';
import workerClient from '../worker/statePersisterWorkerClient';
import stateSyncService from '../service/stateSyncService';

class StateFixer {

  fix(stateOld, stateNew) {
    // Need checker to see if we need to rollback
    if (timeTravelTransaction.isTimeTravelNecessary()) {
      console.log('pausing queue');
      workerClient.pauseAndFlush();
      workerClient.persistStateNoResponse(stateOld, stateNew);

      // Add flush here to clean out persister queue.
      const promise = stateSyncService.rollbackToTransaction(1234);

      promise.then(() => {
        // Unpause worker client here.
        workerClient.unpausePersister();
      });
      promise.catch((error) => {
        // Unpause worker client here.
        console.log(error);
        workerClient.unpausePersister();
      });
    } else {
      workerClient.persistStateNoResponse(stateOld, stateNew);
    }
  }
}

export default new StateFixer();