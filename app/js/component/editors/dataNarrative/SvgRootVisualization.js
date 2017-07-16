import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';

const SvgRootVisualization = {};

SvgRootVisualization.enter = (selection) => {
  // translate(${d3.event.translate})
  selection.attr('transform', (d) => {
    c.l(d, 'data: ');
    return `scale(${d.zoom})`;
  });
};

SvgRootVisualization.update = (selection) => {
  // translate(${d3.event.translate})
  selection.select('g').attr('transform', (d) => {
    c.l(d, 'data: ');
    return `scale(${d.zoom})`;
  });
};

export default SvgRootVisualization;
