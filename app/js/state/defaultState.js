class DefaultState {

  getInstance() {
    return {
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
