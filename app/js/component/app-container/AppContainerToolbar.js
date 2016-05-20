
import React from 'react';
import { connect } from 'react-redux';
import { appLabelOnChange, showStandardModal } from '../../actions';
import TimeTravel from '../../time-travel/TimeTravel';
import appContainerService from '../../service/component/appContainerService';
import crudActionCreator from '../../actions/crudActionCreator';
import StateRollbackModal from '../../component/modals/StateRollbackModal';

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
        <StateRollbackModal />
      </div>
    );
  }
}

function addAppLocal() {
  const addApp = (state) => {
    const label = state.dom.view.appContainer.section.addNew.appLabel;
    const jsonStateOld = JSON.stringify(state);
    const stateNew = JSON.parse(jsonStateOld);
    return appContainerService.addAppAsync(stateNew, jsonStateOld, label);
  };
  return crudActionCreator.invoke(addApp);
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
    onClick: () => {
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
