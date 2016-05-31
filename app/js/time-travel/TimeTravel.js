import React from 'react';
import stateSyncService from '../service/stateSyncService';
import { actionSetState } from '../actions';
import stateGetAndDispatch from '../domain/stateGetAndDispatch';
import { connect } from 'react-redux';

class TimeTravelComponent extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onClickGetEarlierState} className="time-travel">
          &#8249;
        </button>
        <button onClick={this.props.onClickGetLaterState} className="time-travel">
          &#8250;
        </button>
      </div>
    );
  }
}

TimeTravelComponent.propTypes = {
  onClickGetLaterState: React.PropTypes.func.isRequired,
  onClickGetEarlierState: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickGetLaterState: () => {
      stateGetAndDispatch.getLaterStateAndDispatch(dispatch);
    },
    onClickGetEarlierState: () => {
      stateGetAndDispatch.getEarlierStateAndDispatch(dispatch);
    }
  };
};

TimeTravelComponent = connect(
  null,
  mapDispatchToProps
)(TimeTravelComponent);

export default TimeTravelComponent;
