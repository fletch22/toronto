import f22Uuid from '../../../util/f22Uuid';

class ViewFactory {

  createPageView()  {
    return {
      id: f22Uuid.generate(),
      selectedChildViewId: null
    };
  }

  createLayoutView() {
    return {
      id: f22Uuid.generate()
    };
  }
}

export default new ViewFactory();
