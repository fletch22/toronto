import { drag } from 'd3-drag';
import { event } from 'd3-selection';

const SvgRootVisualization = {};
const duration = 40;

SvgRootVisualization.enter = (selection) => {
  selection.attr('transform', (d) => {
    return `translate(${d.viewCoordinates.x}, ${d.viewCoordinates.y}) scale(${d.zoom})`;
  });
};

SvgRootVisualization.update = (selection) => {
  selection.attr('transform', (d) => {
    return `translate(${d.viewCoordinates.x}, ${d.viewCoordinates.y}) scale(${d.zoom})`;
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
      onDrag(event.x, event.y);
    }).on('end', () => {
      draggable = false;
      afterDrag();
    });

  selection.call(dragThing);
};

export default SvgRootVisualization;
