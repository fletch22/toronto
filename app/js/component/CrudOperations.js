import _ from 'lodash';
import crudActionCreator from '../actions/crudActionCreator';
import ComponentService from '../service/component/componentService';
import modalDispatcher from './modals/ModalDispatcher';
import graphTraversal from '../state/graphTraversal';

class CrudOperations {

  removeNode(id, successCallback) {
    const removeAppCallback = (dispatch, state) => {
      const model = graphTraversal.find(state.model, id);

      console.debug(`Model for delete: ${JSON.stringify(model)}`);

      const stateNew = _.cloneDeep(state);

      const componentService = new ComponentService();
      c.l('Calling delete');
      const promise = componentService.delete(stateNew, state, model.parentId, model.id);

      promise.then((obj) => {
        successCallback();
        Promise.resolve(obj);
      }).catch((error) => {
        modalDispatcher.dispatchErrorModal(error, `There was an error removing the ${model.typeLabel}.`, dispatch);
      });

      return promise;
    };

    return crudActionCreator.invoke(removeAppCallback);
  }

  updateProperty(component, property, newPropertyValue) {
    const changeLabelCallback = (dispatch, state) => {
      const jsonStateOld = JSON.stringify(state);
      const stateNew = JSON.parse(jsonStateOld);

      const componentService = new ComponentService();
      const promise = componentService.update(stateNew, jsonStateOld, component.id, property, newPropertyValue);

      promise.catch((error) => {
        modalDispatcher.dispatchErrorModal(error, `There was an error updating the ${component.typeLabel} object.`, dispatch);
      });

      return promise;
    };

    return crudActionCreator.invoke(changeLabelCallback);
  }
}

export default new CrudOperations();
