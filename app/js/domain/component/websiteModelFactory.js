import ComponentTypes from './ComponentTypes';
import Component from './Component';
import uuid from 'node-uuid';

class WebsiteModelFactory extends Component {

  createInstance(model) {
    if (model.label === null
      || model.label === 'undefined'
      || model.label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    let id = model.childId;
    if (!model.childId) {
      id = uuid.v1();
    }

    const instance = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.Website,
      children: []
    };

    return instance;
  }
}

export default new WebsiteModelFactory();
