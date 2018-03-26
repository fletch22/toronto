import { drag } from 'd3-drag';
import { event as currentEvent } from 'd3-selection';

const SvgRootVisualization = {};
const duration = 10;

SvgRootVisualization.enter = (selection) => {
  selection.attr('transform', (d) => {
    return `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`;
  });
};

SvgRootVisualization.update = (selection) => {
  selection.attr('transform', (d) => {
    return `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`;
  });
};

SvgRootVisualization.drag = (selection, beforeDrag, onDrag, afterDrag) => {
  let draggable = false;
  const dragThing = drag()
    .on('start', () => {
      setTimeout(() => {
        draggable = true;
      }, duration);
      beforeDrag();
    }).on('drag', () => {
      if (!draggable) return;
      onDrag(currentEvent.x, currentEvent.y);
    }).on('end', () => {
      draggable = false;
      afterDrag();
    });

  selection.call(dragThing);

  return dragThing;
};

export default SvgRootVisualization;
