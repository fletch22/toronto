import ModelFactory from './ModelFactory';

class LayoutModelFactory extends ModelFactory {

  createInstance(model) {
    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      typeLabel: model.typeLabel,
      children: []
    };

    return instance;
  }
}

export default new LayoutModelFactory();
