import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';

class ButtonSubmit extends React.Component {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style);

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return (
      <div>
        <button className={classNames} style={style} onClick={this.props.onClick}>{this.props.label}</button>
      </div>
    );
  }
}

ButtonSubmit.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  isSelected: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    isSelected: ownProps.viewModel.isSelected,
    viewModel: ownProps.viewModel,
    label: ownProps.viewModel.viewModel.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(ownProps.id));
    }
  };
};

ButtonSubmit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSubmit);

export default ButtonSubmit;


