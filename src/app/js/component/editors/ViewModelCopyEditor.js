import React from 'react';
import graphTraversal from '../../state/graphTraversal';
import modalDispatcher from '../modals/modalDispatcher';
import crudActionCreator from '../../actions/crudActionCreator';

class ViewModelCopyEditor extends React.Component {
  static createUpdate(_dispatch, ownProps, createUpdateCallback) {

    const dispatchHelper = () => {
      const createUpdate = (dispatch, state) => {
        try {
          const view = graphTraversal.find(state, ownProps.id);

          const jsonStateOld = JSON.stringify(state);
          const stateNew = JSON.parse(jsonStateOld);

          return createUpdateCallback(stateNew, jsonStateOld, view)
            .then((result) => {
              console.debug('Success Callback.');
              return Promise.resolve(result);
            })
            .catch((error) => {
              console.debug('Failure Callback.');
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to update component.', dispatch);
              return Promise.reject(error);
            });
        } catch (error) {
          console.error(error);
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

  static createUpdateNew(_dispatch, createUpdateCallback, successCallback) {

    const dispatchHelper = () => {
      const createUpdate = (dispatch, state) => {
        try {
          const jsonStateOld = JSON.stringify(state);
          const stateNew = JSON.parse(jsonStateOld);

          return createUpdateCallback(stateNew, jsonStateOld)
            .then((result) => {
              console.info('Success Callback.');
              return Promise.resolve(result);
            })
            .catch((error) => {
              console.info('Failure Callback.');
              modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to update component.', dispatch);
              return Promise.reject(error);
            });
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      };

      return crudActionCreator.invoke(createUpdate, successCallback);
    };

    _dispatch(dispatchHelper());
  }
}

export default ViewModelCopyEditor;
