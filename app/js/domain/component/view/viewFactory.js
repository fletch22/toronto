import f22Uuid from '../../../util/f22Uuid';

class ViewFactory {

  createPageView() {
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
      isStatic: false,
      areMinionBordersVisible: false
    };
  }

  createLayoutMinionView() {
    return {
      id: f22Uuid.generate(),
      isSelected: false
    };
  }

  createDivView() {
    return {
      id: f22Uuid.generate(),
      isSelected: false
    };
  }

  createDdlView() {
    return {
      id: f22Uuid.generate(),
      isSelected: false
    };
  }

  createDatastoreView() {
    return {
      id: f22Uuid.generate()
    };
  }

  createDataModelView() {
    return {
      id: f22Uuid.generate()
    };
  }
}

export default new ViewFactory();
