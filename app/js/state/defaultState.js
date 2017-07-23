class DefaultState {

  getInstance() {
    return {
      views: [],
      dom: {
        hasInitialStateBeenSaved: false,
        modal: [],
        pseudoModals: [],
        view: {
          appContainer: {
            section: {
              addNew: {
                appLabel: ''
              }
            },
            children: []
          },
          timeTravelNavBar: {
            show: false
          },
          miscViews: {}
        }
      },
      model: {
        appContainer: {
          id: -1,
          children: []
        }
      },
      serverStartupTimestamp: null,
      typeLiveViewAttributes: null
    };
  }
}

export default new DefaultState();
