import Component from './Component';

class WebFolderModelFactory extends Component {

  createInstance(model) {
    this.validateNotBlank(model.pageName, 'pageName');

    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      pageName: model.pageName,
      typeLabel: model.typeLabel,
      children: []
    };

    return instance;
  }
}

export default new WebFolderModelFactory();
