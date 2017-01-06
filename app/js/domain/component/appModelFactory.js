import ComponentTypes from './ComponentTypes';
import Component from './Component';
import uuid from 'node-uuid';

class AppModelFactory extends Component {

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
