import f22Uuid from '../../../util/f22Uuid';

class ViewFactory {

  createPageView()  {
    return {
      id: f22Uuid.generate(),
      selectedChildViewId: null,
      isSelected: false
    };
  }

  createLayoutView() {
    return {
      id: f22Uuid.generate(),
      isSelected: false,
      isStatic: false
    };
  }

  createLayoutMinionView() {
    return {
      id: f22Uuid.generate(),
      isSelected: false
    };
  }
}

export default new ViewFactory();
