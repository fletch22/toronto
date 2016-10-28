class DefaultState {

  getInstance() {
    return {
      dom: {
        hasInitialStateBeenSaved: false,
        modal: [],
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
          }
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
