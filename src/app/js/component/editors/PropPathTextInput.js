import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../actions/index';

class PropPathTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.refs.input.blur();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 8) {
      this.props.onChange(event);
    }
  }

  render() {
    const value = (this.props.value) ? this.props.value : '';
    return (
      <div>
        <input className={this.props.classNames} type="text" ref="input" value={value}
          onChange={this.props.onChange} onBlur={this.props.onBlur} onKeyUp={this.handleKeyPress}
        />
      </div>
    );
  }
}

PropPathTextInput.propTypes = {
  id: PropTypes.any,
  path: PropTypes.string,
  persistState: PropTypes.bool,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  classNames: PropTypes.string,
  onChange: PropTypes.func,
  onChangeExternal: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const persistState = ownProps.persistStateArrays ? ownProps.persistStateArrays : false;

  return {
    onChange: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, ownProps.path, event.target.value, persistState));
      if (!!ownProps.onChangeExternal) {
        ownProps.onChangeExternal(event);
      }
    }
  };
};

PropPathTextInput = connect(
  null,
  mapDispatchToProps
)(PropPathTextInput);

export default PropPathTextInput;



