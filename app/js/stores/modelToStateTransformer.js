import defaultState from './../state/defaultState';

function Transformer() {
  const self = this;

  self.transform = function transform(model) {
    const apps = [];

    model.children.list.forEach((child) => {
      const application = {
        label: child.label,
        id: child.id,
        parentId: child.parentId
      };
      apps.push(application);
    });

    const state = Object.assign({}, defaultState);

    state.model.appContainer.id = model.id;
    state.model.appContainer.children = apps;

    return state;
  };

  self.isValid = function isValid(model) {
    let result = false;
    if (model.parentId === 0 // NOTE: Little bit leaky abstraction here.
    && model.children.haveChildrenBeenResolved) {
      result = true;
    }

    return result;
  };
}

export default new Transformer();
