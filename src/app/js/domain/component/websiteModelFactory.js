import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import ModelFactory from './ModelFactory';

class WebsiteModelFactory extends ModelFactory {

  createInstance(model) {
    if (model.label === null
      || model.label === 'undefined'
      || model.label === '') {
      throw new Error('Encountered problem with label. Must have non-zeo-length value.');
    }

    const id = this.ensureId(model);

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
