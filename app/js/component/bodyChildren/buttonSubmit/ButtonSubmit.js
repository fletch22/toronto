import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import BodyChild from '../BodyChild';
import { findDOMNode } from 'react-dom';
import ItemTypes from '../../dragAndDrop/ItemTypes';
import { DragSource as dragSource, DropTarget as dropTarget} from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    /* eslint-disable no-param-reassign */
    monitor.getItem().index = hoverIndex;
  }
};

class ButtonSubmit extends BodyChild {
  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;

    c.l(`Is Draggin' ${isDragging}`);

    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return connectDragSource(connectDropTarget(
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
  onClick: PropTypes.func,
  moveCard: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
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

ButtonSubmit = reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSubmit);

ButtonSubmit = dragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ButtonSubmit);

ButtonSubmit = dropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(ButtonSubmit);

export default ButtonSubmit;


