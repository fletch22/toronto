import f22Uuid from '../../../util/f22Uuid';

class DataNarrativeViewFactory {

  createInstance(parentComponentViewId, children) {
    return {
      id: f22Uuid.generate(),
      parentComponentViewId,
      children
    };
  }
}

export default new DataNarrativeViewFactory();
