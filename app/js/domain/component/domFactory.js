class DomFactory {

  createApp(app) {
    return {
      parentId: app.parentId,
      id: app.id,
      isShowingHeaderMenu: false,
      children: app.children
    };
  }

  createWebsite(website) {
    return {
      parentId: website.parentId,
      id: website.id,
      children: website.children
    };
  }
}

export default new DomFactory();
