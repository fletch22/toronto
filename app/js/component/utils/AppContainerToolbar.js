
import React from 'react';
import { connect } from 'react-redux';
import { actionChangeAppLabelInput, actionShowErrorModal, actionSetStateAndPersist, actionHideCurrentModal, actionShowTimeTravelNavBar } from '../../actions';
import appContainerService from '../../service/component/appContainerService';
import crudActionCreator from '../../actions/crudActionCreator';
import ModalWrangler from '../../component/modals/ModalWrangler';
import TimeTravelNavBar from './TimeTravelNavBar';
import restService from '../../service/restService';

class AppContainerToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.onNukeAndPaveClick = this.onNukeAndPaveClick.bind(this);
  }

  onNukeAndPaveClick() {
    restService.nukeAndPave()
      .then((result) => {
        console.log(`Success: ${JSON.stringify(result)}`);
        window.document.location.href = window.document.location.href;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="container-fluid toolbar-container">
        <div className="row-fluid">
          <div className="col-lg-1">
            <input type="text" value={this.props.appLabel} onChange={this.props.onChange} />
          </div>
          <div className="col-lg-1">
          </div>
          <div className="col-lg-1">
            <button className="toolbar-button" onClick={this.props.onClick}>
              +
            </button>
          </div>
          <div className="col-lg-1"><span className="toolbar-label">Number Added: <span className="toolbar-label-value">{this.props.numberApps}</span></span></div>
          <div className="col-lg-2">
            <button onClick={this.props.onShowTimeTravelOverlay} className="toolbar-buttons">Time Travel</button>
            <button onClick={this.onNukeAndPaveClick} className="toolbar-buttons">Nuke & Pave</button>
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
      const errorModalDto = {
        headerText: error.name,
        bodyText: error.message
      };

      if (typeof error.responseObject === 'object') {
        errorModalDto.headerText = 'There was an error creating the app.';
        errorModalDto.bodyText = error.responseObject.systemMessage;
      }

      const okAction = actionHideCurrentModal();
      dispatch(actionShowErrorModal(errorModalDto.headerText, errorModalDto.bodyText, okAction));
    });

    return promise;
  };

  return crudActionCreator.invoke(addApp);
}

AppContainerToolbar.propTypes = {
  appLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  onShowError: React.PropTypes.func.isRequired,
  onShowTimeTravelOverlay: React.PropTypes.func,
  onNukeAndPaveClick: React.PropTypes.func
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

const processNukeAndPaveClick = (dispatch) => {
  restService.nukeAndPave()
    .then((result) => {
      console.log(`Success: ${JSON.stringify(result)}`);
      // window.document.location.href = window.document.location.href;
    })
    .catch((error) => {
      console.log(error);
    });
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(addAppLocal());
    },
    onChange: (event) => {
      dispatch(actionChangeAppLabelInput(event.target.value));
    },
    onShowError: () => {
      dispatch(showSampleErrorModal());
    },
    onShowTimeTravelOverlay: () => {
      dispatch(actionShowTimeTravelNavBar());
    },
    onNukeAndPaveClick: () => {
      processNukeAndPaveClick(dispatch);
    }
  };
};

AppContainerToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainerToolbar);

export default AppContainerToolbar;
