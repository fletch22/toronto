import f22Uuid from '../../../../../common/util/f22Uuid';

class ViewFactory {

  createPageView(model) {
    return {
      id: f22Uuid.generate(),
      selectedChildViewId: null,
      isSelected: false,
      needsSaving: false,
      canBeDroppedOn: true,
      pageName: model.pageName,
      style: model.style
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
      isSelected: false,
      canBeDroppedOn: true,
      visibility: true
    };
  }

  createDdlView(model) {
    return {
      id: f22Uuid.generate(),
      elementId: model.elementId,
      dataStoreId: model.dataStoreId,
      dataModelId: model.dataModelId,
      dataValueId: model.dataValueId,
      dataTextId: model.dataTextId,
      isSaveButtonDisabled: true,
      canBeDroppedOn: false,
      visibility: true
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

  createDataFieldView() {
    return {
      id: f22Uuid.generate()
    };
  }

  createButtonSubmitView(model) {
    return {
      id: f22Uuid.generate(),
      elementId: model.elementId,
      label: model.label,
      canBeDroppedOn: false,
      visibility: true
    };
  }

  createDataNarrativeView() {
    return {
      id: f22Uuid.generate()
    };
  }
}

export default new ViewFactory();
