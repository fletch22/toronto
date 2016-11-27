import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../actions/index';

class ViewInput extends React.Component {

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
    return (
      <div>
        <input type="text" ref="input" value={this.props.value} onChange={this.props.onChange} onBlur={this.props.onBlur} className="" onKeyUp={this.handleKeyPress} />
      </div>
    );
  }
}

ViewInput.propTypes = {
  id: PropTypes.any,
  propertyPath: PropTypes.string,
  persistState: PropTypes.boolean,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.id, ownProps.path, event.target.value, ownProps.persistState));
    }
  };
};

ViewInput = connect(
  null,
  mapDispatchToProps
)(ViewInput);

export default ViewInput;



