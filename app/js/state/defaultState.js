class DefaultState {

  getInstance() {
    return {
      dom: {
        standardModal: [],
        view: {
          appContainer: {
            section: {
              addNew: {
                appLabel: ''
              }
            }
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