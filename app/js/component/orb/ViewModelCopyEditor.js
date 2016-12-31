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

          console.log(JSON.stringify(view.model));

          return createUpdateCallback(stateNew, jsonStateOld, view.model)
            .then((result) => {
              console.debug('Success Callback.');
              return Promise.resolve(result);
            })
            .catch((error) => {
              console.debug('Failure Callback.');
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to add website.', dispatch);
              return Promise.reject(error);
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
