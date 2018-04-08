import { drag } from 'd3-drag';
import { event as currentEvent } from 'd3-selection';

class SVGDrag {
  static setup(propOnBefore, propOnDrag, propAfterDrag) {
    const duration = 10;

    let draggable = false;
    const beforeDrag = (d) => {
      setTimeout(() => {
        draggable = true;
      }, duration);
      propOnBefore(d);
    };

    const onDrag = (d) => {
      if (!draggable) return;
      propOnDrag(d, currentEvent.x, currentEvent.y);
    };

    const afterDrag = (d) => {
      draggable = false;
      propAfterDrag(d);
    };

    return drag()
      .on('start', beforeDrag)
      .on('drag', onDrag)
      .on('end', afterDrag);
  }
}

export default SVGDrag;
