import graphTraversal from '../../state/graphTraversal';
import viewModelFactory from '../../reducers/viewModelFactory';
import phantomDropperModelFactory from '../../domain/component/phantomDropperModelFactory';
import f22Uuid from '../../util/f22Uuid';

class DndActionHandler {
  static handleHover(state, stateNew, hoverOveredId, draggedId, position) {
    // c.l(`hoid: ${hoverOveredId}; pos: ${position}`);
    const dragNDrop = stateNew.dragNDrop;
    let needsUpdate = false;

    let parentOfDraggedItem = null;
    const draggedItem = graphTraversal.find(stateNew, draggedId);
    parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
    const indexCurrenDraggedItem = graphTraversal.getChildsIndex(parentOfDraggedItem.viewModel.children, dragNDrop.draggedId);
    // if (draggedId !== dragNDrop.draggedId
    // || (draggedItem.parentId !== parentOfDraggedItem.id || dragNDrop.indexDraggedItem !== indexCurrenDraggedItem)) {
    dragNDrop.draggedId = draggedId;
    // const draggedItem = graphTraversal.find(stateNew, draggedId);
    // parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
    dragNDrop.indexDraggedItem = indexCurrenDraggedItem;
    dragNDrop.parentOfDraggedItemId = draggedItem.parentId;
    draggedItem.visibility = false;
    needsUpdate = true;
    // }


    let parentOfHoverOver = null;
    if (hoverOveredId !== dragNDrop.hoverOverId) {
      dragNDrop.hoverOverId = hoverOveredId;
      parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
      dragNDrop.parentOfHoverOverId = parentOfHoverOver.id;
      let hoverChildsIndex = graphTraversal.getChildsIndex(parentOfHoverOver.viewModel.children, dragNDrop.hoverOverId);

      if (dragNDrop.parentOfHoverOverId === dragNDrop.parentOfDraggedItemId) {
        if (dragNDrop.indexDraggedItem < hoverChildsIndex) {
          hoverChildsIndex--;
        }
      }
      dragNDrop.indexChildTarget = (position === 'before') ? hoverChildsIndex : hoverChildsIndex + 1;
      needsUpdate = true;
    }

    if (needsUpdate) {
      if (!parentOfDraggedItem) {
        parentOfDraggedItem = graphTraversal.findParent(stateNew, dragNDrop.draggedId);
      }

      if (!parentOfHoverOver) {
        parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
      }
      DndActionHandler.moveAsPhantom(stateNew, parentOfDraggedItem, parentOfHoverOver);
    }

    return stateNew;

    // if (needsUpdate) {
    //   if (!parentOfDraggedItem) {
    //     parentOfDraggedItem = graphTraversal.findParent(stateNew, dragNDrop.draggedId);
    //   }
    //
    //   if (!parentOfHoverOver) {
    //     parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
    //   }
    //
    //   DndActionHandler.moveAsPhantom(dragNDrop, parentOfDraggedItem, parentOfHoverOver);
    // }

    // return stateNew;

    // let isMoveLegal = false;
    // if (dragNDrop.parentOfDraggedItemId === dragNDrop.parentOfHoverOverId) {
    //   if (dragNDrop.draggedId !== dragNDrop.hoverOverId
    //     && dragNDrop.indexDraggedItem !== dragNDrop.indexChildTarget) {
    //     isMoveLegal = true;
    //   }
    // } else {
    //   isMoveLegal = true;
    // }

    // if (isMoveLegal) {
    //   // stateNew.dragNDrop = JSON.parse(JSON.stringify(stateNew.dragNDrop));
    //   return stateNew;
    // } else {
    //   return state;
    // }
  }

  static moveAsPhantom(state, parentOfDragged, parentOfHover) {
    c.l('Phantom should drop ...');
    const dragNDrop = state.dragNDrop;
    const draggedItem = graphTraversal.find(state, dragNDrop.draggedId);
    draggedItem.visibility = false;

    const model = phantomDropperModelFactory.createInstance(parentOfDragged.viewModel.id, f22Uuid.generate());
    const phantomDropper = viewModelFactory.generateViewModel(parentOfDragged.id, model);

    parentOfHover.viewModel.children.splice(dragNDrop.indexChildTarget, 0, phantomDropper);
    /* eslint-disable no-param-reassign */
    parentOfHover.viewModel.children = [].concat(parentOfHover.viewModel.children);
  }

  static moveAsPhantomOld(dragNDrop, parentOfDragged, parentOfHover) {
    if (dragNDrop.draggedId !== dragNDrop.hoverOverId) {
      c.l('Will move ...');
      // const parentOfDragged = graphTraversal.find(state, dnd.parentOfDraggedItemId);
      const draggedItem = parentOfDragged.viewModel.children.splice(dragNDrop.indexDraggedItem, 1)[0];
      /* eslint-disable no-param-reassign */
      parentOfDragged.viewModel.children = [].concat(parentOfDragged.viewModel.children);

      // const parentOfHover = graphTraversal.find(state, dnd.parentOfHoverOverId);
      parentOfHover.viewModel.children.splice(dragNDrop.indexChildTarget, 0, draggedItem);
      draggedItem.parentId = parentOfHover.id;
      parentOfHover.viewModel.children = [].concat(parentOfHover.viewModel.children);
    }
  }
}

export default DndActionHandler;
