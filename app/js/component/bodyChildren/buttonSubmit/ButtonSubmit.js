import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import DropMarker from '../../bodyChildren/DropMarker';
import ComponentTypes from '../../../domain/component/ComponentTypes';

class ButtonSubmit extends BodyChild {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    const display = this.props.visibility ? style.display : 'none';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.id} onClick={this.props.onClick} data-f22-component={ComponentTypes.ButtonSubmit} style={{ paddingRight: '4px', display }}>
        <button className={classNames} style={style}>{this.props.label}</button>
        <DropMarker ownerId={this.props.id} />
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

  const visibility = viewModel.visibility;
  return {
    isSelected: viewModel.isSelected,
    viewModel,
    label: viewModel.viewModel.label,
    canBeDroppedOn: viewModel.canBeDroppedOn,
    dragNDrop: state.dragNDrop,
    visibility
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

ButtonSubmit = DragAndDropMaker.connectDragAndDrop(ButtonSubmit);

export default ButtonSubmit;



