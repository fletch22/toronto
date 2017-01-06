class DomFactory {

  createAppContainer(model) {
    return {
      section: {
        addNew: {
          appLabel: ''
        }
      },
      id: model.id,
      isShowingHeaderMenu: false,
      children: []
    };
  }

  createApp(app) {
    return {
      parentId: app.parentId,
      id: app.id,
      isShowingHeaderMenu: false,
      children: []
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

  createLayoutDiv(layoutDiv) {
    return {
      parentId: layoutDiv.parentId,
      id: layoutDiv.id,
      children: []
    };
  }
}

export default new DomFactory();
