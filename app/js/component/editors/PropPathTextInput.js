import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import '../../../css/modules/container.scss';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../actions/index';

class PropPathTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.refs.input.blur();
    }
  }

  render() {
    const value = (this.props.value) ? this.props.value : '';
    return (
      <div>
        <input className={this.props.classNames} type="text" ref="input" value={value} onChange={this.props.onChangeDataStore} onBlur={this.props.onBlur} onKeyUp={this.handleKeyPress} />
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
  onChangeDataStore: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const persistState = ownProps.persistState ? ownProps.persistState : false;

  return {
    onChangeDataStore: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, ownProps.path, event.target.value, persistState));
    }
  };
};

PropPathTextInput.contextTypes = { store: PropTypes.object };

PropPathTextInput = connect(
  null,
  mapDispatchToProps
)(PropPathTextInput);

export default PropPathTextInput;



