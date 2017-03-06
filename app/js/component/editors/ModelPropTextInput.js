import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';
import { connect } from 'react-redux';
import { actionUpdateOrbPropertyNoPersist } from '../../actions/index';

class ModelPropTextInput extends React.Component {

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
        <input type="text" ref="input" value={this.props.value} onChange={this.props.onChange} onBlur={this.props.onBlur} className="darkTextbox" onKeyUp={this.handleKeyPress} />
      </div>
    );
  }
}

ModelPropTextInput.propTypes = {
  modelNodeId: PropTypes.any,
  value: PropTypes.string,
  propertyName: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (event) => {
      dispatch(actionUpdateOrbPropertyNoPersist(ownProps.modelNodeId, ownProps.propertyName, event.target.value));
    }
  };
};

ModelPropTextInput = connect(
  null,
  mapDispatchToProps
)(ModelPropTextInput);

export default ModelPropTextInput;



