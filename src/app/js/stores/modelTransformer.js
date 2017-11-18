class ModelTransformer {

  transform(appContainerModel) {
    const model = {
      appContainer: {
        children: []
      }
    };

    model.appContainer.id = appContainerModel.id;
    model.appContainer.typeLabel = appContainerModel.typeLabel;

    appContainerModel.children.list.forEach((child) => {
      const application = {
        label: child.label,
        typeLabel: child.typeLabel,
        id: child.id,
        parentId: child.parentId
      };

      model.appContainer.children.push(application);
    });

    return model;
  }
}

export default ModelTransformer;
