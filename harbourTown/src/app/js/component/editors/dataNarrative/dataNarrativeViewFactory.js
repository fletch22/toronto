import f22Uuid from '../../../../../common/util/f22Uuid';

class DataNarrativeViewFactory {

  createInstance(parentComponentViewId, children) {
    return {
      id: f22Uuid.generate(),
      zoom: 1,
      viewCoordinates: { x: 0, y: 0 },
      viewCoordinatesDragOffset: { x: 0, y: 0 },
      parentComponentViewId,
      children
    };
  }
}

export default new DataNarrativeViewFactory();
