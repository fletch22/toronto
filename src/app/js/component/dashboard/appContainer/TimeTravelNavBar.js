import React from 'react';
import { connect } from 'react-redux';
import 'app/css/modules/time-travel-toolbar';
import stateGetAndDispatch from '../../../domain/stateGetAndDispatch';

class TimeTravelNavBar extends React.Component {

  render() {
    return (
      <div style={{ display: this.props.displayCss }} className="time-travel-toolbar">
        <div className="time-travel-toolbar-body">
          <div className="toolbar-buttons">
            <button onClick={this.props.onClickGetFirstState} className="time-travel">
              <i className="fa fa-fast-backward" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onClickGetEarlierState} className="time-travel">
              <i className="fa fa-step-backward" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onSetAndCloseClick} className="time-travel">
              <i className="fa fa-play" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onClickGetLaterState} className="time-travel">
              <i className="fa fa-step-forward" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onClickGetMostRecentState} className="time-travel">
              <i className="fa fa-fast-forward" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className="modal-backdrop"></div>
      </div>
    );
  }
}

TimeTravelNavBar.propTypes = {
  show: React.PropTypes.bool,
  onClickGetFirstState: React.PropTypes.func.isRequired,
  onClickGetLaterState: React.PropTypes.func.isRequired,
  onClickGetEarlierState: React.PropTypes.func.isRequired,
  onClickGetMostRecentState: React.PropTypes.func.isRequired,
  onSetAndCloseClick: React.PropTypes.func.isRequired,
  displayCss: React.PropTypes.string
};

const mapStateToProps = (state) => {
  const displayCss = (state.dom.view.timeTravelNavBar.show || window.showTimeTravelNavBar) ? 'block' : 'none';

  return {
    displayCss
  };
};

function rollbackServerAndHideTimeTravelBar()  {
  return (dispatch) => {
    const promise = stateGetAndDispatch.rollbackToCurrentState(dispatch);

    promise.catch((error) => {
      console.error(error.message);
    });
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickGetLaterState: () => {
      stateGetAndDispatch.getLaterStateAndDispatch(dispatch);
    },
    onClickGetEarlierState: () => {
      stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);
    },
    onSetAndCloseClick: () => {
      dispatch(rollbackServerAndHideTimeTravelBar());
    },
    onClickGetFirstState: () => {
      stateGetAndDispatch.getFirstState(dispatch);
    },
    onClickGetMostRecentState: () => {
      stateGetAndDispatch.getMostRecentState(dispatch);
    }
  };
};

TimeTravelNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeTravelNavBar);

export default TimeTravelNavBar;
