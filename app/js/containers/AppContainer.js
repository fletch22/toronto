import React from 'react';
import { connect } from 'react-redux';
import { addApp } from '../actions';

let AppContainer = ({ onClick, numberApps, apps }) => {
  console.log('In AppContainer.');
  return (
    <div>
      <div className="container-fluid toolbar-container">
          <div className="row-fluid">
              <div className="col-lg-1">
                  <button className="toolbar-button" onClick={onClick}>
                   + Add
                  </button>
              </div>
              <div className="col-lg-1"><span className="toolbar-label">Number Added: <span className="toolbar-label-value">{numberApps}</span></span></div>
          </div>
      </div>
      <div className="container-fluid app-container">
        {
          apps.map((app) =>
            <div className="container-app col-lg-2" key={app.id}>{app.label}</div>
          )
        }
      </div>
    </div>
    );
};

AppContainer.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  apps: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  const appsChildren = Object.assign({}, state).children;

  return {
    numberApps: appsChildren.length,
    apps: appsChildren
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log('from mapDispatchToProps');
  return {
    onClick: () => {
      dispatch(addApp({ foo: 'bar' }));
    }
  };
};

AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);

export default AppContainer;
