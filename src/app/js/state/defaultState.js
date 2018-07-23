class DefaultState {

  getInstance() {
    return {
      centralizedRefs: [],
      dragNDrop: {
        hoverOverId: null,
        parentOfHoverOverId: null,
        draggedId: null,
        indexDraggedItem: null,
        parentOfDraggedItemId: null,
        indexChildTarget: null,
        position: null,
        measurements: null,
        lastChildViewModelId: null
      },
      borderScrivener: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        visible: false,
        lastUpdateRequest: new Date().getMilliseconds(),
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
