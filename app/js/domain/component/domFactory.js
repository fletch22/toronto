class DomFactory {

  createApp(app) {
    return {
      parentId: app.parentId,
      id: app.id,
      isShowingHeaderMenu: false
    };
  }
}

export default new DomFactory();
