import React from 'react';
import { connect } from 'react-redux';
import 'css/modules/time-travel-toolbar';
import stateGetAndDispatch from '../../domain/stateGetAndDispatch';
import { actionHideTimeTravelNavBar } from '../../actions/index';

class TimeTravelNavBar extends React.Component {

  render() {
    return (
      <div style={{ display: this.props.displayCss }} className="time-travel-toolbar">
        <div className="time-travel-toolbar-body">
          <button onClick={this.props.onClickGetEarlierState} className="time-travel">
            &#8249;
          </button>
          <button onClick={this.props.onSetAndCloseClick} className="time-travel">
            0
          </button>
          <button onClick={this.props.onClickGetLaterState} className="time-travel">
            &#8250;
          </button>
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
