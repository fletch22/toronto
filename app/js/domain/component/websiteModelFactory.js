import ComponentTypes from './ComponentTypes';
import ModelFactory from './ModelFactory';
import uuid from 'node-uuid';

class WebsiteModelFactory extends ModelFactory {

  createInstance(model) {
    if (model.label === null
      || model.label === 'undefined'
      || model.label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    let id = this.ensureId(model);

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
