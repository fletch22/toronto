import React from 'react';
import _reduxDevtools from 'redux-devtools';
import { connect } from 'react-redux';

console.log(_reduxDevtools);

//const reset = _reduxDevtools.ActionCreators.reset;
// var jumpToState = _reduxDevtools.ActionCreators.jumpToState;


class ButtonReset extends React.Component {
  render() {
    return (
      <button >Reset State</button>
    );
  }
}

ButtonReset.propTypes = {
  onClick: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch("test");
    }
  };
};

ButtonReset = connect(
  mapDispatchToProps
)(ButtonReset);

export default ButtonReset;
