import React from 'react';
import { connect } from 'react-redux';
import { actionChangeAppLabelInput,
  actionShowErrorModal,
  actionSetStateAndPersist,
  actionHideCurrentModal,
  actionShowTimeTravelNavBar,
  actionNukeAndPave,
  processRestoreFromDiskClick } from '../../../actions';
import appContainerService from '../../../service/component/appContainerService';
import crudActionCreator from '../../../actions/crudActionCreator';
import ModalWrangler from '../../../component/modals/ModalWrangler';
import TimeTravelNavBar from './TimeTravelNavBar';
import modalDispatch from '../../modals/modalDispatcher';
import 'css/modules/time-travel-toolbar';
import persistAppService from '../../../service/appPersistenceService';

class AppContainerToolbar extends React.Component {

  render() {
    return (
      <div className="container-fluid toolbar-container">
        <div className="row-fluid">
          <div className="col-lg-1">
            <input type="text" value={this.props.appLabel} onChange={this.props.onChangeDataStore} />
          </div>
          <div className="col-lg-1">
          </div>
          <div className="col-lg-1">
            <button className="toolbar-button" onClick={this.props.onClick}>
              +
            </button>
          </div>
          <div className="col-lg-1"><span className="toolbar-label">Numbers Added: <span className="toolbar-label-value">{this.props.numberApps}</span></span></div>
          <div className="col-lg-3">
            <button id="police-box" onClick={this.props.onShowTimeTravelOverlay} className="btn btn-default button-application-toolbar"></button>
            <button id="nuke-and-pave" onClick={this.props.onNukeAndPaveClick} className="btn btn-default button-application-toolbar"></button>
            <button id="save-system-to-disk" onClick={this.props.onSaveSystemToDiskClick} className="btn btn-default button-application-toolbar"></button>
            <button id="restore-system-from-disk" onClick={this.props.onRestoreSystemFromDiskClick} className="btn btn-default button-application-toolbar"></button>
            <TimeTravelNavBar />
          </div>
        </div>
        <ModalWrangler />
      </div>
    );
  }
}

function addAppLocal() {
  const addApp = (dispatch, state) => {
    const label = state.dom.view.appContainer.section.addNew.appLabel;
    const jsonStateOld = JSON.stringify(state);
    const stateNew = JSON.parse(jsonStateOld);
    const promise = appContainerService.addAppAsync(stateNew, jsonStateOld, label);

    promise.catch((error) => {
      modalDispatch.dispatchErrorModal(error, 'There was an error creating the app.', dispatch);
    });

    return promise;
  };

  return crudActionCreator.invoke(addApp);
}

AppContainerToolbar.propTypes = {
  appLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  onChangeDataStore: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  onShowError: React.PropTypes.func.isRequired,
  onShowTimeTravelOverlay: React.PropTypes.func,
  onNukeAndPaveClick: React.PropTypes.func,
  onSaveSystemToDiskClick: React.PropTypes.func,
  onRestoreSystemFromDiskClick: React.PropTypes.func
};

const mapStateToProps = (state) => {
  const appsChildren = Object.assign({}, state).model.appContainer.children;

  return {
    numberApps: appsChildren.length,
    appLabel: (state.dom.view.appContainer.section.addNew.appLabel) ? state.dom.view.appContainer.section.addNew.appLabel : ''
  };
};

function showSampleErrorModal() {
  return (dispatch, getState) => {
    // NOTE: Necessary to avoid circular references.
    const jsonState = JSON.stringify(getState());

    dispatch(actionShowErrorModal('sampleHeaderText', 'sampleBodyText', actionSetStateAndPersist(JSON.parse(jsonState))));
  };
}

const processNukeAndPaveClick = () => (dispatch) => {
  const headerText = 'Danger!';
  const bodyText = 'You are about to destroy all your data. Are you sure?';

  modalDispatch.dispatchConfirmModal(dispatch, headerText, bodyText, actionNukeAndPave, actionHideCurrentModal, actionHideCurrentModal);
};

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(addAppLocal());
  },
  onChangeDataStore: (event) => {
    dispatch(actionChangeAppLabelInput(event.target.value));
  },
  onShowError: () => {
    dispatch(showSampleErrorModal());
  },
  onShowTimeTravelOverlay: () => {
    dispatch(actionShowTimeTravelNavBar());
  },
  onNukeAndPaveClick: () => {
    dispatch(processNukeAndPaveClick());
  },
  onSaveSystemToDiskClick: () => {
    persistAppService.persist(dispatch);
  },
  onRestoreSystemFromDiskClick: () => {
    dispatch(processRestoreFromDiskClick());
  }
});

AppContainerToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainerToolbar);

export default AppContainerToolbar;
