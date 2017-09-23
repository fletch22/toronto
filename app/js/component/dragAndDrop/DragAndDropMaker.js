import { PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  },
  endDrag(props, monitor) {
    const draggedItem = monitor.getItem();
    const didDrop = monitor.didDrop();

    c.l(`endDrop: ${draggedItem.id}; props.id: ${props.id}`);

    if (didDrop) {
      props.moveAsPhantom(draggedItem.id, props.id);
    } else {
      // Cancel drag - make original reappear.
      props.cancelDrag();
    }
  }
};


const isBeforeOrAfter = (component, monitor) => {
  const dom = findDOMNode(component);

  const style = window.getComputedStyle(dom);
  let isVerticalLayout;

  const direction = style['flex-direction'];
  switch (direction) {
    case 'row':
      isVerticalLayout = false;
      break;
    case 'column':
      isVerticalLayout = true;
      break;
    default:
      throw new Error(`Encountered error trying to interpret unrecognized flex-direction: '${direction}.'`);
  }

  // Determine rectangle on screen
  const hoverBoundingRect = dom.getBoundingClientRect();

  let position = 'before';
  if (isVerticalLayout) {
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Find out which is lower/higher
    if (hoverClientY > hoverMiddleY) {
      position = 'after';
    }
  } else {
    // Get vertical middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Find out which is lower/higher
    if (hoverClientX > hoverMiddleX) {
      position = 'after';
    }
  }
  return position;
};

const cardTarget = {
  hover(props, monitor, component) {
    // c.l('Hovering...');
    const hoverItem = props;
    const dragItem = monitor.getItem();

    // Don't replace items with themselves
    if (hoverItem.id === dragItem.id) {
      return;
    }

    const position = isBeforeOrAfter(component, monitor);

    props.hoverOver(dragItem.id, hoverItem.id, position);
  },
  canDrop(props) {
    return props.viewModel.canBeDroppedOn;
  },
  drop(props, monitor, component) {
    const hoverItem = props;
    const dragItem = monitor.getItem();

    // Don't replace items with themselves
    if (hoverItem.id === dragItem.id) {
      return undefined;
    }

    return dragItem;
  }
};

class DragAndDropMaker {
  static connect(ComponentClass) {
    /* eslint-disable no-param-reassign */
    ComponentClass.propTypes = DragAndDropMaker.incorporateEnhancedPropTypes(ComponentClass.propTypes);

    let ComponentClassEnhanced = dragSource(ItemTypes.GENERIC_ITEM, cardSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }))(ComponentClass);

    ComponentClassEnhanced = dropTarget(ItemTypes.GENERIC_ITEM, cardTarget, (connect) => ({
      connectDropTarget: connect.dropTarget()
    }))(ComponentClassEnhanced);

    return ComponentClassEnhanced;
  }

  static incorporateEnhancedPropTypes(propTypes) {
    return Object.assign(propTypes, {
      moveCard: PropTypes.func,
      hoverOver: PropTypes.func,
      connectDragSource: PropTypes.func.isRequired,
      connectDropTarget: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      isHoveredOver: PropTypes.bool,
      canBeDroppedOn: PropTypes.bool,
      isParentHoveredOver: PropTypes.bool,
      parentHoverOvered: PropTypes.object,
      dragNDrop: PropTypes.object,
      visibility: PropTypes.bool,
      cancelDrag: PropTypes.func,
      moveAsPhantom: PropTypes.func
    });
  }

  static connectRender(props, content) {
    const { connectDragSource, connectDropTarget } = props;

    return connectDragSource(connectDropTarget(content));
  }
}

export default DragAndDropMaker;

