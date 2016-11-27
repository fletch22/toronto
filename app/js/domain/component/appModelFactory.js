import ComponentTypes from './ComponentTypes';
import Component from './component';
import uuid from 'node-uuid';

class AppModelFactory extends Component {

  createInstance(parentId, label, childId) {
    if (label === null
      || label === 'undefined'
      || label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    let id = childId;
    if (!childId) {
      id = uuid.v1();
    }

    const app = {
      parentId: parentId,
      id: id,
      label: label,
      typeLabel: ComponentTypes.App,
      children: []
    };

    return app;
  }
}

export default new AppModelFactory();
