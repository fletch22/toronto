import ComponentTypes from './ComponentTypes';
import ModelFactory from './ModelFactory';

class AppModelFactory extends ModelFactory {

  createInstance(model) {
    this.validateNotBlank(model.label);

    const id = this.ensureId(model);

    const app = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.App,
      children: []
    };

    return app;
  }
}

export default new AppModelFactory();
