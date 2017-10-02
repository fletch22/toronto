import graphTraversal from '../../state/graphTraversal';
import viewModelFactory from '../../reducers/viewModelFactory';
import phantomDropperModelFactory from '../../domain/component/phantomDropperModelFactory';
import f22Uuid from '../../util/f22Uuid';

class DndActionHandler {
  static handleHover(state, stateNew, hoverOveredId, draggedId, measurements) {

    const dragNDrop = stateNew.dragNDrop;

    dragNDrop.measurements = measurements;
    const position = dragNDrop.measurements.position;

    const draggedItem = graphTraversal.find(stateNew, draggedId);
    const parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
    const indexCurrentDraggedItem = graphTraversal.getChildsIndex(parentOfDraggedItem.viewModel.children, dragNDrop.draggedId);
    if (draggedId !== dragNDrop.draggedId
    || (draggedItem.parentId !== parentOfDraggedItem.id || dragNDrop.indexDraggedItem !== indexCurrentDraggedItem)) {
      dragNDrop.draggedId = draggedId;
      dragNDrop.indexDraggedItem = indexCurrentDraggedItem;
      dragNDrop.parentOfDraggedItemId = draggedItem.parentId;
      draggedItem.visibility = false;
    }

    let parentOfHoverOver = null;

    if (hoverOveredId !== dragNDrop.hoverOverId || position !== dragNDrop.position) {
      dragNDrop.hoverOverId = hoverOveredId;
      parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
      dragNDrop.parentOfHoverOverId = parentOfHoverOver.id;
      const hoverChildsIndex = graphTraversal.getChildsIndex(parentOfHoverOver.viewModel.children, dragNDrop.hoverOverId);

      dragNDrop.indexChildTarget = (position === 'before') ? hoverChildsIndex : hoverChildsIndex + 1;
      dragNDrop.indexChildTarget = (dragNDrop.indexChildTarget < 0) ? 0 : dragNDrop.indexChildTarget;
    }

    return stateNew;
  }

  // static moveAsPhantom(state, parentOfHover) {
  //   const dragNDrop = state.dragNDrop;
  //
  //   let phantomDropper;
  //   if (!!dragNDrop.phantomDropperId) {
  //     phantomDropper = graphTraversal.find(state, dragNDrop.phantomDropperId);
  //   } else {
  //     const model = phantomDropperModelFactory.createInstance(parentOfHover.viewModel.id, f22Uuid.generate());
  //     phantomDropper = viewModelFactory.generateViewModel(parentOfHover.id, model);
  //     dragNDrop.phantomDropperId = phantomDropper.id;
  //   }
  //
  //   if (!!phantomDropper) {
  //     const parentOfDropper = graphTraversal.find(state, phantomDropper.parentId);
  //     parentOfDropper.viewModel.children = parentOfDropper.viewModel.children.filter(child => child.id !== phantomDropper.id);
  //     phantomDropper.parentId = parentOfHover.id;
  //   }
  //
  //   parentOfHover.viewModel.children.splice(dragNDrop.indexChildTarget, 0, phantomDropper);
  //
  //   /* eslint-disable no-param-reassign */
  //   parentOfHover.viewModel.children = [].concat(parentOfHover.viewModel.children);
  // }
}

export default DndActionHandler;
