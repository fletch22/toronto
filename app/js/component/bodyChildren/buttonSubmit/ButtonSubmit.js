import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';

class ButtonSubmit extends BodyChild {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return DragAndDropMaker.connectRender(this.props, (
      <div id={this.props.id} onClick={this.props.onClick} style={{ paddingRight: '4px' }}>
        <button className={classNames} style={style}>{this.props.label}</button>
      </div>
    ));
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
  const viewModel = ownProps.viewModel;

  c.l(`DragNDrop aint falsey: ${!!state.dragNDrop}`);

  return {
    isSelected: viewModel.isSelected,
    viewModel,
    label: viewModel.viewModel.label,
    canBeDroppedOn: viewModel.canBeDroppedOn,
    dragNDrop: state.dragNDrop
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

ButtonSubmit = reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSubmit);

ButtonSubmit = DragAndDropMaker.connect(ButtonSubmit);

export default ButtonSubmit;



