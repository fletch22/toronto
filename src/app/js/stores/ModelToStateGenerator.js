import containerService from '../service/component/containerService';

class ModelToStateGenerator {

  constructor(state) {
    this.state = state;
  }

  process(modelFromServer) {
    this.state.model = {
      appContainer: {
        children: []
      }
    };

    this.state.model.appContainer.id = modelFromServer.id;
    this.state.model.appContainer.typeLabel = modelFromServer.typeLabel;
    this.state.dom.view.appContainer.id = modelFromServer.id;

    this.createChildren(modelFromServer);

    return this.state;
  }

  createChildren(parent) {
    if (parent.children && !!parent.children.list) {
      parent.children.list.forEach((child) => this.createChild(child));
    }
  }

  createChild(child) {
    containerService.addModel(this.state, child);
    this.createChildren(child);
  }
}

export default ModelToStateGenerator;
