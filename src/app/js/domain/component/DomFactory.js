class DomFactory {

  static createAppContainer(model) {
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

  static createApp(app) {
    return {
      parentId: app.parentId,
      id: app.id,
      isShowingHeaderMenu: false,
      children: []
    };
  }

  static createWebsite(website) {
    return {
      parentId: website.parentId,
      id: website.id,
      children: []
    };
  }

  static createWebFolder(webFolder) {
    return {
      parentId: webFolder.parentId,
      id: webFolder.id,
      children: []
    };
  }

  static createWebPage(webPage) {
    return {
      parentId: webPage.parentId,
      id: webPage.id,
      activeTab: null,
      children: []
    };
  }

  static createLayout(layoutDiv) {
    return {
      parentId: layoutDiv.parentId,
      id: layoutDiv.id,
      children: []
    };
  }
}

export default DomFactory;
