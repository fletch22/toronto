import crudActionCreator from '../../actions/crudActionCreator';
import ComponentService from '../../service/component/componentService';
import errorHandlerDispatch from '../../component/modals/ErrorHandlerDispatch';
import { connect } from 'react-redux';

class ComponentCrudOperations {

  removeNode(component) {
    const removeAppCallback = (dispatch, state) => {

      const jsonStateOld = JSON.stringify(state);
      const stateNew = JSON.parse(jsonStateOld);

      const componentService = new ComponentService();
      const promise = componentService.delete(stateNew, jsonStateOld, component.parentId, component.id);

      promise.catch((error) => {
        errorHandlerDispatch.handle(error, `There was an error removing the ${component.typeLabel}.`, dispatch);
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
        errorHandlerDispatch.handle(error, `There was an error updating the ${component.typeLabel} object.`, dispatch);
      });

      return promise;
    };

    return crudActionCreator.invoke(changeLabelCallback);
  }
}

export default new ComponentCrudOperations();
