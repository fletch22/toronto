import ModelFactory from './ModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import f22Uuid from '../../../../common/util/f22Uuid';

class DataModelFieldFactory extends ModelFactory {
  createInstanceFromModel(model) {
    this.validateNotBlank(model.label, 'label');

    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.DataField,
      children: []
    };
  }
}

export default new DataModelFieldFactory();
