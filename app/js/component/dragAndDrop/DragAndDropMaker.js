import { PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
// import DragCorner from '../../component/dragAndDrop/DragCorner';

const cardSource = {
  beginDrag(props) {
    let id = props.id;
    let index = props.index;

    if (props.clazz && props.clazz === 'DragCorner') {
      id = props.selectedElementId;
      index = props.selectedElementIndex;
    }

    return {
      id,
      index
    };
  },
  endDrag(props, monitor) {
    const didDrop = monitor.didDrop();

    if (didDrop) {
      props.move();
    } else {
      // Cancel drag - make original reappear.
      c.l('Cancelling.');
      props.cancelDrag();
    }
  }
};


const getPositionAndDimensions = (component, monitor, canBeDroppedOn) => {
  // c.l(`Component iboa null: ${component === null}`);
  // const dom = findDOMNode(component);

  // c.l(`Ref node found? ${!!component.node}`);

  const node = component.node || findDOMNode(component);

  // c.l(`Refs node: ${component.refs.node === null}.`);

  // c.l(`Element ID: ${dom.getAttribute('id')}`);
  // c.lo(node.getAttribute('id'), 'node id: ');
  // c.lo(node.getAttribute('style'), 'node id: ');

  const style = window.getComputedStyle(node);
  let isVerticalLayout;

  // c.lo(dom, 'dom');
  // c.lo(component.decoratedComponentInstance, 'dci: ');
  // c.lo(style, 'cstyle: ');

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
  const hoverBoundingRect = node.getBoundingClientRect();

  let position = 'before';
  const division = 9;
  const beforeSectionFraction = (1 / division);
  const middleSectionFraction = (division - 1) / division;

  if (canBeDroppedOn) {
    if (isVerticalLayout) {
      // Get vertical middle
      const beforeMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) * beforeSectionFraction;
      const middleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) * middleSectionFraction;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top + window.pageYOffset;

      // Find out which is lower/higher
      if (hoverClientY > beforeMiddleY && hoverClientY < middleY) {
        position = 'middle';
      } else if (hoverClientY > middleY) {
        position = 'after';
      }
    } else {
      // Get horizontal middle
      const beforeMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) * beforeSectionFraction;
      const middleX = (hoverBoundingRect.right - hoverBoundingRect.left) * middleSectionFraction;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left + window.pageXOffset;

      // Find out which is lower/higher
      if (hoverClientX > beforeMiddleX && hoverClientX < middleX) {
        position = 'middle';
      } else if (hoverClientX > middleX) {
        position = 'after';
      }
    }
  } else {
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
  }

  return {
    position,
    hoverBoundingRect,
    isVerticalLayout
  };
};


const canBeDroppedOn = (props) => {
  // NOTE: 10-17-2017: fleschec: Bit of voodoo here; The Body tag will not have viewModel. Instead the 'canBeDroppedOn' property will be directly on props. If it's not on props, then we can assume
  // we shouldn't be dropping on the target at all.
  return props.canBeDroppedOn || props.viewModel.canBeDroppedOn;
};

const cardTarget = {
  hover(props, monitor, component) {
    // NOTE: 09-30-2017: fleschec: if an argument is passed to 'isOver', it **MUST** be { shallow: true } -- otherwise
    // it doesn't work correctly. { shallow: false } does not work.
    if (!monitor.isOver({ shallow: true })) {
      return;
    }

    const coordinates = monitor.getClientOffset();

    const hoverItem = props;
    const dragItem = monitor.getItem();

    if (hoverItem.id === dragItem.id) {
      props.hoverOver(dragItem.id, hoverItem.id, 'before', null);
    }

    if (!component) {
      return;
    }

    const positionAndDimensions = getPositionAndDimensions(component, monitor, canBeDroppedOn(props));

    const measurements = Object.assign(positionAndDimensions, coordinates);

    if (!!props.hoverOver) {
      props.hoverOver(dragItem.id, hoverItem.id, measurements);
    }
  },
  canDrop(props) {
    return canBeDroppedOn(props);
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
  static connectDrop(ComponentClass) {
    /* eslint-disable no-param-reassign */
    ComponentClass.propTypes = DragAndDropMaker.incorporateBasicAndDropPropTypes(ComponentClass.propTypes);

    return DragAndDropMaker.connectDropTarget(ComponentClass);
  }

  static connectDropTarget(ComponentClass) {
    return dropTarget(ItemTypes.GENERIC_ITEM, cardTarget, (connect) => ({
      connectDropTarget: connect.dropTarget()
    }))(ComponentClass);
  }

  static connectDragAndDrop(ComponentClass) {
    /* eslint-disable no-param-reassign */
    ComponentClass.propTypes = DragAndDropMaker.incorporateDragAndDropPropTypes(ComponentClass.propTypes);

    let ComponentClassEnhanced = DragAndDropMaker.connectDropTarget(ComponentClass);

    ComponentClassEnhanced = dragSource(ItemTypes.GENERIC_ITEM, cardSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }))(ComponentClassEnhanced);

    return ComponentClassEnhanced;
  }

  static incorporateBasicAndDropPropTypes(propTypes) {
    return Object.assign(propTypes, {
      move: PropTypes.func,
      hoverOver: PropTypes.func,
      connectDropTarget: PropTypes.func.isRequired,
      canBeDroppedOn: PropTypes.bool,
      dragNDrop: PropTypes.object
    });
  }

  static incorporateDragAndDropPropTypes(propTypes) {
    return Object.assign(propTypes, DragAndDropMaker.incorporateBasicAndDropPropTypes(propTypes), {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      visibility: PropTypes.bool,
      cancelDrag: PropTypes.func
    });
  }

  static connectDropRender(props, content) {
    const { connectDropTarget } = props;

    return connectDropTarget(content);
  }

  static connectDragAndDropRender(props, content) {
    const { connectDragSource, connectDropTarget } = props;

    return connectDragSource(connectDropTarget(content));
  }
}

export default DragAndDropMaker;

