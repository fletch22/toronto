import React from 'react';
import _reduxDevtools from 'redux-devtools';
import { connect } from 'react-redux';

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
  null,
  mapDispatchToProps
)(ButtonReset);

export default ButtonReset;
