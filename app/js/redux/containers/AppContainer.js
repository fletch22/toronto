import React from 'react';
import { connect } from 'react-redux';
import { addApp } from '../actions';

let AppContainer = ({ onClickX, numberApps, apps }) => {
  console.log('In AppContainer.');
  return (
    <div>
      <div className="container-fluid toolbar-container">
          <div className="row-fluid">
              <div className="col-lg-1">
                  <button className="toolbar-button" onClick={onClickX}>
                   + Add
                  </button>
              </div>
              <div className="col-lg-1"><span className="toolbar-label">Number Added: <span className="toolbar-label-value">{numberApps}</span></span></div>
          </div>
      </div>
      <div className="container-fluid app-container">
        {
          apps.map(() => 'app')
        }
      </div>
    </div>
    );
};

AppContainer.propTypes = {
  onClickX: React.PropTypes.func.isRequired,
  numberApps: React.PropTypes.number.isRequired,
  apps: React.PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  console.log(JSON.stringify(state));
  console.log('mapStateToProps.');
  const apps = Object.assign({}, state).apps;

  console.log('Number of apps found: ' + apps.length);

  return {
    numberApps: state.apps.length,
    apps: apps
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  console.log('from mapDispatchToProps');
  return {
    onClickX: () => {
      dispatch(addApp({'foo': 'bar'}));
    }
  };
};

AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);

export default AppContainer;
