import ModelFactory from './ModelFactory';
import ComponentTypes from './ComponentTypes';

class PhantomDropperModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.PhantomDropper,
      elementId: model.elementId,
      style: model.style || null
    };
  }

  createInstance(parentId, elementId) {
    return this.createInstanceFromModel({ parentId, elementId });
  }
}

export default new PhantomDropperModelFactory();
