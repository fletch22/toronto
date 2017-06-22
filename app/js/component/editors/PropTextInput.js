import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';
import { connect } from 'react-redux';
import { actionUpdatePropertyNoPersist } from '../../actions/index';

class PropTextInput extends React.Component {

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
        <input type="text" ref="input" value={this.props.value} onChange={this.props.onChangeDataStore} onBlur={this.props.onBlur} onKeyUp={this.handleKeyPress} />
      </div>
    );
  }
}

PropTextInput.propTypes = {
  uuid: PropTypes.any,
  value: PropTypes.string,
  propertyName: PropTypes.string,
  onBlur: PropTypes.func,
  onChangeDataStore: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeDataStore: (event) => {
      dispatch(actionUpdatePropertyNoPersist(ownProps.uuid, ownProps.propertyName, event.target.value));
    }
  };
};

PropTextInput = connect(
  null,
  mapDispatchToProps
)(PropTextInput);

export default PropTextInput;



