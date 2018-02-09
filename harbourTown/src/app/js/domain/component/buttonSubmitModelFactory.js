import ModelFactory from './ModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

class ButtonSubmitModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.ButtonSubmit,
      elementId: model.elementId,
      label: model.label,
      style: model.style || null,
      ordinal: model.ordinal
    };
  }

  createInstance(parentId, elementId, label, ordinal) {
    return this.createInstanceFromModel({ parentId, elementId, label, ordinal });
  }
}

export default new ButtonSubmitModelFactory();
