import Component from './Component';

class WebFolderModelFactory extends Component {

  createInstance(model) {
    this.validateNotBlank(model.label, 'label');

    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: model.typeLabel,
      children: []
    };

    return instance;
  }
}

export default new WebFolderModelFactory();
