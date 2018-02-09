import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import ModelFactory from './ModelFactory';

class AppContainerFactory extends ModelFactory {

  createInstance(model) {
    this.validateNotBlank(model.label);

    const id = this.ensureId(model);

    const appContainer = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.AppContainer,
      children: []
    };

    return appContainer;
  }
}

export default new AppContainerFactory();
