import modalDispatcher from '../component/modals/modalDispatcher';
import restService from '../service/restService';
import { actionHideCurrentModal } from '../actions/index';

class AppPersistenceService {

  persist(dispatch) {
    restService.persistToDisk()
      .then((result) => {
        console.debug('Successfully called persist.');
        modalDispatcher.dispatchStandardModal(dispatch, 'Success!', 'Application ecosystem successfully persisted to disk.', actionHideCurrentModal);
        return Promise.resolve(result);
      })
      .catch((error) => {
        console.debug('Persist call failed.');
        modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to persist app ecosystem.', dispatch);
        return Promise.reject(error);
      });
  }
}

export default new AppPersistenceService();
