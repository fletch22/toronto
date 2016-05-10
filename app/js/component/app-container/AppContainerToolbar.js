import React from 'react';
import { connect } from 'react-redux';
import { setState, appLabelOnChange, showStandardModal } from '../../actions';
import TimeTravel from '../../time-travel/TimeTravel';
import appContainerService from '../../service/component/appContainerService';
import statePersisterWorkerClient from '../../worker/statePersisterWorkerClient';

class AppContainerToolbar extends React.Component {
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
          <div className="col-lg-1">
            <TimeTravel />
          </div>
          <div className="col-lg-1">
            <button className="showModal" onClick={this.props.onShowOverlay}>Show Overlay</button>
          </div>
        </div>
      </div>
    );
  }
}

class GenericListener {

  constructor() {
    this.TYPE = 'message';
    this.callback = null;
  }

  register(callback) {
    this.callback = callback;
    window.addEventListener(this.TYPE, callback, false);
  }

  unregister() {
    window.removeEventListener(this.TYPE, this.callback, false);
  }
}

function addAppLocal() {
  return (dispatch, getState) => {

    let expectedId;

    const genericListener = new GenericListener();

    const messageProcessor = (event) => {

      if (typeof event.data !== 'string') {
        return;
      }

      const eventMessage = JSON.parse(event.data);
      if (eventMessage.id === expectedId) {
        genericListener.unregister();
        const state = getState();
        const label = state.dom.view.appContainer.section.addNew.appLabel;
        const jsonStateOld = JSON.stringify(state);
        appContainerService.addAppAsync(state, jsonStateOld, label)
          .then((response) => {
            dispatch(setState(response));
            statePersisterWorkerClient.unblockade();
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    };

    genericListener.register(messageProcessor);

    expectedId = statePersisterWorkerClient.blockadeAndDrain();
  };
}

AppContainerToolbar.propTypes = {
  appLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  onShowOverlay: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const appsChildren = Object.assign({}, state).model.appContainer.children;

  return {
    numberApps: appsChildren.length,
    appLabel: (state.dom.view.appContainer.section.addNew.appLabel) ? state.dom.view.appContainer.section.addNew.appLabel : ''
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (event) => {
      //dispatch(addApp());
      //dispatch(addAppLocal(new Date().getMilliseconds()));
      dispatch(addAppLocal());
    },
    onChange: (event) => {
      dispatch(appLabelOnChange(event.target.value));
    },
    onShowOverlay: () => {
      dispatch(showStandardModal(true, 'sampleHeaderText'));
    }
  };
};

AppContainerToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainerToolbar);

export default AppContainerToolbar;
