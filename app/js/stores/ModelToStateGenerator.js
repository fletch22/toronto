import ComponentTypes from '../domain/component/componentTypes';
import appModelFactory from '../domain/component/appModelFactory';
import domFactory from '../domain/component/domFactory';

class ModelToStateGenerator {

  constructor(state) {
    this.state = state;
    this.modelAppContainer = state.model.appContainer;
    this.domAppContainer = state.dom.view.appContainer;
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

    console.log(`Is not null? ${typeof this.state.dom.view.appContainer}`);

    return this.processChildren(this.state.model.appContainer, this.state.dom.view.appContainer, modelFromServer);
  }

  processChildren(modelParent, domParent, parent) {
    this.ensureDefined(domParent);
    parent.children.forEach((child) => this.processChild(modelParent, domParent, child));
  }

  processChild(modelParent, domParent, child) {
    let modelChild;
    let domChild;
    switch (child.typeLabel) {
      case ComponentTypes.App: {
        modelChild = appModelFactory.createInstance(child.parentId, child.label);
        domChild = domFactory.createApp(modelChild);
        if (child.children) this.processChildren(modelChild, domChild, child.children);
        break;
      }
      default:
        throw new Error('Could not find generator to render model.');
    }
    modelParent.children.push(modelChild);
    domParent.children.push(domChild);
  }
}

export default ModelToStateGenerator;
