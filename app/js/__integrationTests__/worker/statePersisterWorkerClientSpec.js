import statePersisterWorkerClient from '../../worker/statePersisterWorkerClient';
import WorkerMessage from '../../worker/workerMessage';
import { WorkerMessageTypes } from '../../worker/workerMessage';
import { expect } from 'chai';

describe('statePersisterWorkerClient', () => {

  it('should relay broadcast messages correctly.', (done) => {

    let expectedId;

    window.addEventListener('message', (event) => {
      const eventMessage = JSON.parse(event.data);

      expect(typeof eventMessage.id).to.not.equal('undefined');
      expect(expectedId).to.equal(eventMessage.id);
      done();
    });

    console.log('About to drain message.');
    expectedId = statePersisterWorkerClient.blockadeAndDrain();
  });
});
