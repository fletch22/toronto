class DefaultState {

  getInstance() {

    console.log("Anyone calling?");

    return {
      dom: {
        hasInitialStateBeenSaved: false,
        modal: [],
        pseudoModals: ['test'],
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
      serverStartupTimestamp: null
    };
  }
}

export default new DefaultState();
