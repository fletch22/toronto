import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import websiteContainerService from '../../../../service/component/websiteContainerService';
import crudActionCreator from '../../../../actions/crudActionCreator';
import { actionConstructViewModel, actionUpdateViewPropertyValue, actionDeleteViewModel } from '../../../../actions/index';
import modalDispatch from '../../../../component/modals/ModalDispatcher';
import graphTraversal from '../../../../state/graphTraversal';

class CreateUpdateWebsite extends React.Component {

  constructor(props, { store }) {
    super(props);
    this.store = store;
  }

  componentDidMount() {
    const viewModel = {
      id: this.props.id,
      label: this.props.label
    };

    this.store.dispatch(actionConstructViewModel(viewModel));
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-2"><label>ID:</label></div>
          <div className="col-lg-10">{this.props.data.id}</div>
        </div>
        <div className="row">
          <div className="col-xs-2"><label>Parent ID:</label></div>
          <div className="col-lg-10">{this.props.data.modelNodeId}</div>
        </div>
        <div className="row">
          <div className="col-lg-2" style={{ margin: '4px 0 0 0' }}><label>Label:</label></div>
          <div className="col-lg-10"><input className="form-control f22-text-input" type="text" value={this.props.label} onChange={this.props.onChangeLabel} /></div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div style={{ display: 'inline', float: 'right' }}>
              <button type="button" onClick={this.props.onSaveClick}>Save</button>
              <button type="button" onClick={this.props.onCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateUpdateWebsite.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  label: PropTypes.string,
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  cleanUp: PropTypes.func
};

CreateUpdateWebsite.contextTypes = {
  store: React.PropTypes.object
};

function addWebsiteLocal(_dispatch, ownProps) {
  const dispatchHelper = () => {
    const addWebsite = (dispatch, state) => {
      try {
        const view = state.dom.view.miscViews[ownProps.id];

        const jsonStateOld = JSON.stringify(state);
        const stateNew = JSON.parse(jsonStateOld);

        return websiteContainerService.addWebsiteAsync(stateNew, jsonStateOld, ownProps.data.modelNodeId, view.label)
          .then((result) => {
            return Promise.resolve(result);
          })
          .catch((error) => {
            modalDispatch.dispatchErrorModal(error, 'Encountered error while trying to add website.', dispatch);
          });
      } catch (error) {
        return Promise.reject(error);
      }
    };

    const successCallback = () => {
      // console.log('About to cleanUp ...');
      // ownProps.cleanUp();
      // console.log('About to onCancelClick ...');
      ownProps.onCancelClick();
    };

    return crudActionCreator.invoke(addWebsite, successCallback);
  };

  _dispatch(dispatchHelper());
}

const mapStateToProps = (state, ownProps) => {
  const editWebsite = state.dom.view.miscViews[ownProps.id];

  // const modal = graphTraversal.find(state.dom.modal, ownProps.id);
  // console.log(JSON.stringify(modal));
  // console.log(`In CUW mstp: ${ownProps.id}`);

  const label = (editWebsite && typeof editWebsite.label !== 'undefined') ? editWebsite.label : '';

  return {
    label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    addWebsiteLocal(dispatch, ownProps);
  },
  onChangeLabel: (event) => {
    dispatch(actionUpdateViewPropertyValue(ownProps.id, 'label', event.target.value, true));
  },
  cleanUp: () => {
    dispatch(actionDeleteViewModel(ownProps.id));
  }
});

CreateUpdateWebsite = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUpdateWebsite);

export default CreateUpdateWebsite;
