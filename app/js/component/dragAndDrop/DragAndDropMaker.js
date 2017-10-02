import { PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import ComponentTypes from '../../domain/component/ComponentTypes';

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

    if (didDrop) {
      props.move(draggedItem.id, props.id);
    } else {
      // Cancel drag - make original reappear.
      props.cancelDrag();
    }
  }
};


const isBeforeOrAfter = (component, monitor) => {
  // c.l(`Component iboa null: ${component === null}`);
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
    const hoverClientY = clientOffset.y - hoverBoundingRect.top + window.pageYOffset;

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
    const hoverClientX = clientOffset.x - hoverBoundingRect.left + window.pageXOffset;

    // Find out which is lower/higher
    if (hoverClientX > hoverMiddleX) {
      position = 'after';
    }
  }

  return {
    position,
    hoverBoundingRect
  };
};

const cardTarget = {
  hover(props, monitor, component) {
    // NOTE: 09-30-2017: fleschec: if an argument is passed to 'isOver', it **MUST** be { shallow: true } -- otherwise
    // it doesn't work correctly. { shallow: false } does not work.
    if (!monitor.isOver({ shallow: true })) {
      // c.l(`hi id: ${props.viewModel.viewModel.id}: typeLabel: ${props.viewModel.viewModel.typeLabel}: ${new Date().getMilliseconds()}`);
      return;
    }

    // c.l(`typeLAbel: ${props.viewModel.viewModel.typeLabel}`);
    if (props.viewModel.viewModel.typeLabel === ComponentTypes.PhantomDropper) {
      // c.l('Found dropper.');
      return;
    }

    const coordinates = monitor.getClientOffset();

    const hoverItem = props;
    const dragItem = monitor.getItem();

    if (hoverItem.id === dragItem.id) {
      props.hoverOver(dragItem.id, hoverItem.id, 'before', null);
    }

    // c.l(`component hover: ${!component}`);
    if (!component) {
      return;
    }
    const positionAndDimensions = isBeforeOrAfter(component, monitor);
    // c.lo(hoverItem, 'hi: ');
    // c.l(`p: ${position}: ${hoverItem.viewModel.viewModel.typeLabel}`);

    const measurements = Object.assign(positionAndDimensions, coordinates);

    props.hoverOver(dragItem.id, hoverItem.id, measurements);
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
      move: PropTypes.func,
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

