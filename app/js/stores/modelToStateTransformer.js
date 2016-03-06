

function Transformer() {
  const self = this;

  self.transform = function transform(model) {
    const apps = [];
    model.children.list.forEach((child) => {
      const application = {
        label: child.label,
        id: child.id,
        parentId: child.parentId
      }
      apps.push(application);
    });

    return {
      id: model.id,
      children: apps
    };
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
