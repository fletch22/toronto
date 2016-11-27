import ComponentTypes from '../domain/component/ComponentTypes';
import componentGenerator from '../domain/component/componentGenerator';

class ModelToStateGenerator {

  constructor(state) {
    this.state = state;
  }

  ensureDefined(object) {
    if (typeof object.children === typeof undefined) {
      object.children = [];
    }
  }

  process(modelFromServer) {
    this.state.model = {
      appContainer: {
        children: []
      }
    };

    this.state.model.appContainer.id = modelFromServer.id;
    this.state.model.appContainer.typeLabel = modelFromServer.typeLabel;

    return this.createChildren(this.state.model.appContainer, this.state.dom.view.appContainer, modelFromServer);
  }

  createChildren(modelParent, domParent, parent) {
    this.ensureDefined(domParent);
    if (parent.children && parent.children.list) {
      parent.children.list.forEach((child) => this.createChild(modelParent, domParent, child));
    }

    return this.state;
  }

  createChild(modelParent, domParent, child) {
    let component;

    switch (child.typeLabel) {
      case ComponentTypes.App: {
        component = componentGenerator.createApp(child.parentId, child.label, child.id);
        break;
      }
      default:
        throw new Error('Could not find generator to render model.');
    }

    this.createChildren(component.model, component.dom, child);
    modelParent.children.push(component.model);
    domParent.children.push(component.dom);
  }
}

export default ModelToStateGenerator;
