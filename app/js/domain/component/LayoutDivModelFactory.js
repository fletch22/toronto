import Component from './Component';

class LayoutDivModelFactory extends Component {

  createInstance(model) {
    this.validateNotBlank(model, 'x');
    this.validateNotBlank(model, 'y');
    this.validateNotBlank(model, 'width');
    this.validateNotBlank(model, 'height');
    this.validateNotBlank(model, 'index');

    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      width: model.width,
      height: model.height,
      x: model.x,
      y: model.y,
      index: model.index,
      typeLabel: model.typeLabel,
      children: []
    };

    return instance;
  }
}

export default new LayoutDivModelFactory();
