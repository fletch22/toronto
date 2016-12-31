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
      children: []
    };
  }

  createWebFolder(webFolder) {
    return {
      parentId: webFolder.parentId,
      id: webFolder.id,
      children: []
    };
  }

  createWebPage(webPage) {
    return {
      parentId: webPage.parentId,
      id: webPage.id,
      activeTab: null,
      children: []
    };
  }
}

export default new DomFactory();
