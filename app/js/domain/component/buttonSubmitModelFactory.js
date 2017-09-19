import ModelFactory from './ModelFactory';
import ComponentTypes from './ComponentTypes';

class ButtonSubmitModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.ButtonSubmit,
      elementId: model.elementId,
      label: model.label,
      style: model.style || null
    };
  }

  createInstance(parentId, elementId, label) {
    return this.createInstanceFromModel({ parentId, elementId, label });
  }
}

export default new ButtonSubmitModelFactory();
