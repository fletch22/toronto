import React from 'react';
import { connect } from 'react-redux';
import { addApp, appLabelOnChange } from '../actions';


let AppContainer = ({ appLabel, onClick, onChange, numberApps, children }) => {
  return (
    <div>
      <div className="container-fluid toolbar-container">
          <div className="row-fluid">
            <div className="col-lg-1">
              <input type="text" value={appLabel} onChange={onChange} />
            </div>
            <div className="col-lg-1">
                <button className="toolbar-button" onClick={onClick}>
                 +
                </button>
            </div>
            <div className="col-lg-1"><span className="toolbar-label">Number Added: <span className="toolbar-label-value">{numberApps}</span></span></div>
          </div>
      </div>
      <div className="container-fluid app-container">
        {
          children.map((child) =>
            <div className="container-app col-lg-2" key={child.id}>{child.label}</div>
          )
        }
      </div>
    </div>
    );
};

AppContainer.propTypes = {
  appLabel: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  children: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  const appsChildren = Object.assign({}, state).children;

  return {
    numberApps: appsChildren.length,
    children: appsChildren,
    appLabel: (state.appLabel) ? state.appLabel : ''
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

AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);

export default AppContainer;
