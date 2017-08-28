import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import BodyChild from '../BodyChild';

class ButtonSubmit extends BodyChild {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return (
      <div id={this.props.id} onClick={this.props.onClick} style={{ paddingRight: '4px' }}>
        <button className={classNames} style={style}>{this.props.label}</button>
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


