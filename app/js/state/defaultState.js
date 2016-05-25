class DefaultState {

  getInstance() {
    return {
      dom: {
        modal: [],
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