import React from 'react';
import { connect } from 'react-redux';
import 'css/modules/time-travel-toolbar';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';
import { actionHideTimeTravelNavBar } from '../../actions/index';
import 'font-awesome/scss/font-awesome.scss';

class TimeTravelNavBar extends React.Component {

  render() {
    return (
      <div style={{ display: this.props.displayCss }} className="time-travel-toolbar">
        <div className="time-travel-toolbar-body">
          <div className="toolbar-buttons">
            <button onClick={this.props.onClickGetEarlierState} className="time-travel">
              <i className="fa fa-step-backward" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onSetAndCloseClick} className="time-travel">
              <i className="fa fa-play" aria-hidden="true"></i>
            </button>
            <button onClick={this.props.onClickGetLaterState} className="time-travel">
              <i className="fa fa-step-forward" aria-hidden="true"></i>
            </button>
          </div>
          <div className="close-button text-right">
            <i className="fa fa-times" aria-hidden="true"></i>
          </div>
        </div>
        <div className="modal-backdrop"></div>
      </div>
    );
  }
}

TimeTravelNavBar.propTypes = {
  show: React.PropTypes.bool,
  onClickGetLaterState: React.PropTypes.func.isRequired,
  onClickGetEarlierState: React.PropTypes.func.isRequired,
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
      console.log(error.message);
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
    }

  };
};

TimeTravelNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeTravelNavBar);

export default TimeTravelNavBar;
