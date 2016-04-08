import React from 'react';
import { connect } from 'react-redux';
import { addApp, appLabelOnChange } from '../../actions';
// import ButtonReset from '../../time-travel/ButtonReset';
import TimeTravel from '../TimeTravel';

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
          <div className="col-lg-2">
            <TimeTravel />
          </div>
        </div>
      </div>
    );
  }
}

AppContainerToolbar.propTypes = {
  appLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired
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
      dispatch(addApp());
    },
    onChange: (event) => {
      dispatch(appLabelOnChange(event.target.value));
    }
  };
};

AppContainerToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainerToolbar);

export default AppContainerToolbar;
