import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../actions/index';

class ModelPropTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.focusInput = this.focusInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  onClickLabel(event) {
    this.props.onClickValue(event);
  }

  focusInput(component) {
    if (component) {
      ReactDOM.findDOMNode(component).focus();
    }
    this.textInput = component;
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.textInput.blur();
    }
  }

  render() {
    let labelClassNames = 'text-left';
    labelClassNames += (!this.props.isTextInputFieldVisible) ? '' : ' hidden';
    let inputClassNames = 'text-left no-padding col-md-12';
    inputClassNames += (this.props.isTextInputFieldVisible) ? '' : ' hidden';

    let inputText;
    if (this.props.isTextInputFieldVisible) {
      inputText = (
        <div className={inputClassNames}>
          <input style={{ width: '100%' }}
            type="text"
            ref={this.focusInput}
            value={this.props.value}
            onChange={this.props.onChangeDataStore}
            className="darkTextbox"
            onBlur={this.props.onInitialBlur}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      );
    }

    return (
      <div className="col-md-12 no-padding">
        <div className={labelClassNames} onClick={this.props.onClickValue}>
          {this.props.value}
        </div>
        {
          inputText
        }
      </div>
    );
  }
}

ModelPropTextInput.propTypes = {
  viewModelId: PropTypes.string,
  value: PropTypes.string,
  propertyName: PropTypes.string,
  isTextInputFieldVisible: PropTypes.bool,
  onBlur: PropTypes.func,
  onChangeDataStore: PropTypes.func,
  onClickValue: PropTypes.func,
  onInitialBlur: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeDataStore: (event) => {
      event.stopPropagation();
      event.preventDefault();
      dispatch(actionUpdateViewPropertyValue(ownProps.viewModelId, `viewModel.${ownProps.propertyName}`, event.target.value, false));
    },
    onClickValue: (event) => {
      event.stopPropagation();
      event.preventDefault();
      dispatch(actionUpdateViewPropertyValue(ownProps.viewModelId, 'isTextInputFieldVisible', !ownProps.isTextInputFieldVisible, true));
    },
    onInitialBlur: (event) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.viewModelId, 'isTextInputFieldVisible', false, true));
      ownProps.onBlur(event);
    }
  };
};

ModelPropTextInput = connect(
  null,
  mapDispatchToProps
)(ModelPropTextInput);

export default ModelPropTextInput;



