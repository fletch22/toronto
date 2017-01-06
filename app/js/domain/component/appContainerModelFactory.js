import ComponentTypes from './ComponentTypes';
import Component from './Component';

class AppContainerFactory extends Component {

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
