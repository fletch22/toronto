class DefaultState {

  getInstance() {
    return {
      dom: {
        modal: {
          stateRollback: {
            showModal: false,
            headerText: '',
            bodyText: '',
            stateId: ''
          }
        },
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