class DefaultState {

  getInstance() {
    return {
      borderScrivener: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        visible: false,
        needsUpdate: false,
        selectedElementId: null
      },
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
