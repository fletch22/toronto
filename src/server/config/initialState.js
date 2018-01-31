
export default {
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
    lastUpdateRequest: 322,
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
        children: [
          {
            parentId: 1057,
            id: 1058,
            isShowingHeaderMenu: false,
            children: [
              {
                parentId: 1058,
                id: 1061,
                children: [
                  {
                    parentId: 1061,
                    id: 1062,
                    activeTab: null,
                    children: []
                  }
                ]
              }
            ]
          }
        ],
        id: 1057
      },
      timeTravelNavBar: {
        show: false
      },
      miscViews: {}
    }
  },
  model: {
    appContainer: {
      children: [
        {
          parentId: 1057,
          id: 1058,
          label: 'HelloWorldApp',
          typeLabel: 'App',
          children: [
            {
              parentId: 1058,
              id: 1061,
              label: 'website1',
              typeLabel: 'Website',
              children: [
                {
                  parentId: 1061,
                  id: 1062,
                  pageName: 'page1',
                  typeLabel: 'Page',
                  children: [],
                  style: '{ "flexDirection": "column" }'
                }
              ]
            }
          ]
        },
        {
          parentId: 1057,
          id: 1059,
          label: 'default',
          typeLabel: 'DataUniverse',
          children: [
            {
              parentId: 1059,
              id: 1060,
              label: 'default',
              typeLabel: 'Datastore',
              children: []
            }
          ]
        }
      ],
      id: 1057,
      typeLabel: 'AppContainer'
    }
  },
  serverStartupTimestamp: '1515635114883',
  typeLiveViewAttributes: {
    DropDownListbox: [
      'selected_value'
    ]
  },
  hasInitialStateBeenSaved: false,
  currentId: null
};
