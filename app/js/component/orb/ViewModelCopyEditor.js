import React from 'react';
import graphTraversal from '../../state/graphTraversal';
import modalDispatcher from '../../component/modals/ModalDispatcher';
import crudActionCreator from '../../../js/actions/crudActionCreator';

class ViewModelCopyEditor extends React.Component {
  static createUpdate(_dispatch, ownProps, createUpdateCallback) {

    const dispatchHelper = () => {
      const createUpdate = (dispatch, state) => {
        try {
          const view = graphTraversal.find(state, ownProps.id);

          const jsonStateOld = JSON.stringify(state);
          const stateNew = JSON.parse(jsonStateOld);

          return createUpdateCallback(stateNew, jsonStateOld, view.model)
            .then((result) => {
              return Promise.resolve(result);
            })
            .catch((error) => {
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to add website.', dispatch);
            });
        } catch (error) {
          console.log(error);
          return Promise.reject(error);
        }
      };

      const successCallback = () => {
        ownProps.onCancelClick();
      };

      return crudActionCreator.invoke(createUpdate, successCallback);
    };

    _dispatch(dispatchHelper());
  }
}

ViewModelCopyEditor.contextTypes = {
  store: React.PropTypes.object
};

export default ViewModelCopyEditor;
