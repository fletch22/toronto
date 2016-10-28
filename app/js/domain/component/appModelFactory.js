import ComponentTypes from './componentTypes';
import Component from './component';
import uuid from 'node-uuid';

class AppModelFactory extends Component {

  createInstance(parentId, label) {
    if (label === null
      || label === 'undefined'
      || label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    const app = {
      parentId: parentId,
      id: uuid.v1(),
      label: label,
      typeLabel: ComponentTypes.App
    };

    return app;
  }
}

export default new AppModelFactory();
