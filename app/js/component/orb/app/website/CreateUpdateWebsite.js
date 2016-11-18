import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'css/modules/form';
import websiteContainerService from '../../../../service/component/websiteContainerService';
import modalDispatch from '../../../../component/modals/ModalDispatcher';
import crudActionCreator from '../../../../actions/crudActionCreator';
import { actionUpdateViewPropertyValue } from '../../../../actions/index';
import graphTraversal from '../../../../state/graphTraversal';

class CreateUpdateWebsite extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-1"><label>ID:</label></div>
          <div className="col-lg-1">{this.props.data.id}</div>
        </div>
        <div className="row">
          <div className="col-xs-1"><label>Parent ID:</label></div>
          <div className="col-lg-1">{this.props.data.modelNodeId}</div>
        </div>
        <div className="row">
          <div className="col-lg-1" style={{ margin: '4px 0 0 0' }}><label>Label:</label></div>
          <div className="col-lg-1"><input className="form-control f22-text-input" type="text" value={this.props.label} onChange={this.props.onChangeLabel} /></div>
        </div>
        <div className="row">
          <div className="col-lg-2">
            <button type="button" onClick={this.props.onSaveClick}>Save</button>
            <button type="button" onClick={this.props.onCancelClick}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

CreateUpdateWebsite.propTypes = {
  data: PropTypes.object,
  label: PropTypes.string,
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};

function addWebsiteLocal(dispatch, ownProps) {
  const dispatchHelper = () => {
    const addWebsite = (dispatch, state) => {
      console.log(`ownProps: ${JSON.stringify(ownProps)}`);

      const label = ownProps.label;
      const jsonStateOld = JSON.stringify(state);
      const stateNew = JSON.parse(jsonStateOld);
      const promise = websiteContainerService.addWebsiteAsync(stateNew, jsonStateOld, ownProps.data.modelNodeId, label);

      promise.catch((error) => {
        const errorModalDto = {
          headerText: error.name,
          bodyText: error.message
        };

        if (typeof error.responseObject === 'object') {
          errorModalDto.headerText = 'There was an error creating the app.';
          errorModalDto.bodyText = error.responseObject.systemMessage;
        }

        modalDispatch.dispatchErrorModal(errorModalDto.headerText, errorModalDto.bodyText, dispatch);
      });

      return promise;
    };

    // Return a function that
    console.log('About to invoke crud process.');
    return crudActionCreator.invoke(addWebsite);
  };

  console.log('About to dispatch helper.');
  dispatch(dispatchHelper());
}

const mapStateToProps = (state, ownProps) => {

  const object = graphTraversal.find(state.dom.view, ownProps.data.modelNodeId);

  if (typeof object.views === 'undefined') {
    object.views = {};
  }

  const views = object.views;
  if (typeof views.editwebsite === 'undefined') {
    views.editwebsite = {};
  }

  const editWebsite = views.editWebsite;

  return {
    label: (typeof editWebsite.label !== 'undefined') ? editWebsite.label : ''
  };
};

const actionUpdateWebsiteProperty = (modelNodeId, propertyName, propertyValue) => {
  return actionUpdateViewPropertyValue(modelNodeId, 'editWebsite', propertyName, propertyValue, false);
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    console.log(`object in mdtp: ${JSON.stringify(ownProps)}`);

    addWebsiteLocal(dispatch, ownProps);
  },
  onCancelClick: () => {
    // dispatch();
  },
  onChangeLabel: (event) => {
    dispatch(actionUpdateWebsiteProperty(ownProps.data.modelNodeId, 'label', event.target.value));
  }
});

CreateUpdateWebsite = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUpdateWebsite);

export default CreateUpdateWebsite;
