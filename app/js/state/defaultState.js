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
            }
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
      }
    };
  }
}

export default new DefaultState();
