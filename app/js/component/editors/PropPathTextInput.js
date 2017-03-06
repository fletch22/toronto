import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../actions/index';

class PropPathTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.refs.input.blur();
    }
  }

  render() {
    const value = (this.props.value) ? this.props.value : '';
    return (
      <div>
        <input type="text" ref="input" value={value} onChange={this.props.onChange} onBlur={this.props.onBlur} className="" onKeyUp={this.handleKeyPress} />
      </div>
    );
  }
}

PropPathTextInput.propTypes = {
  id: PropTypes.any,
  propertyPath: PropTypes.string,
  persistState: PropTypes.bool,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const persistState = ownProps.persistState ? ownProps.persistState : false;

  return {
    onChange: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, ownProps.path, event.target.value, persistState));
    }
  };
};

PropPathTextInput = connect(
  null,
  mapDispatchToProps
)(PropPathTextInput);

export default PropPathTextInput;



