export const statePackageTest = {
  CLIENT_ID_dk89h22njkfdu90jo21kl231kl2199: '11e8-16b1-264c09a0-bca1-d922acb0c05a',
  state: {
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
      left: 442,
      top: 75,
      width: 70,
      height: 100,
      visible: true,
      lastUpdateRequest: null,
      selectedElementId: '11e8-16b1-16bb3471-bc6f-09406f2105f4',
      selectedElementIndex: 0
    },
    views: [
      {
        id: '11e8-16af-0df15dd0-9b51-9bf7220bc4c1',
        viewModel: {
          children: [
            {
              id: '11e8-16af-0df184e0-9b51-9bf7220bc4c1',
              isTextInputFieldVisible: false,
              isShowingHeaderMenu: false,
              parentId: '11e8-16af-0df15dd0-9b51-9bf7220bc4c1',
              viewModel: {
                children: [
                  {
                    id: '11e8-16af-0df184e1-9b51-9bf7220bc4c1',
                    isTextInputFieldVisible: false,
                    isShowingHeaderMenu: false,
                    parentId: '11e8-16af-0df184e0-9b51-9bf7220bc4c1',
                    viewModel: {
                      parentId: 1057,
                      id: 1058,
                      label: 'HelloWorldApp',
                      typeLabel: 'App',
                      children: [
                        {
                          id: '11e8-16af-0df184e2-9b51-9bf7220bc4c1',
                          isTextInputFieldVisible: false,
                          isShowingHeaderMenu: false,
                          parentId: '11e8-16af-0df184e1-9b51-9bf7220bc4c1',
                          viewModel: {
                            parentId: 1058,
                            id: 1061,
                            label: 'website1',
                            typeLabel: 'Website',
                            children: [
                              {
                                id: '11e8-16af-0df184e3-9b51-9bf7220bc4c1',
                                isTextInputFieldVisible: false,
                                isShowingHeaderMenu: false,
                                parentId: '11e8-16af-0df184e2-9b51-9bf7220bc4c1',
                                viewModel: {
                                  parentId: 1061,
                                  id: 1062,
                                  pageName: 'page1',
                                  typeLabel: 'Page',
                                  children: [],
                                  style: '{ "flexDirection": "column" }'
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ],
                id: 1057,
                typeLabel: 'AppContainer'
              }
            }
          ]
        },
        viewType: 'Dashboard-Island'
      }
    ],
    dom: {
      hasInitialStateBeenSaved: false,
      modal: [],
      pseudoModals: [
        {
          id: '11e8-16b1-16bb3473-bc6f-09406f2105f4',
          viewName: 'EDIT_WEBSITE_PAGE_DETAILS',
          data: {
            modelNodeId: 1062,
            parentModelNodeId: 1061,
            id: '11e8-16b1-16bb3472-bc6f-09406f2105f4',
            model: {
              parentId: 1061,
              id: 1062,
              pageName: 'page1',
              typeLabel: 'Page',
              children: [
                {
                  parentId: 1062,
                  id: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                  typeLabel: 'Div',
                  style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                  children: [
                    {
                      parentId: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                      id: '11e8-16af-1e0dd130-9efe-99d9a0c0dbb8',
                      elementId: 'Select-1',
                      dataStoreId: 1060,
                      dataModelId: 1063,
                      dataValueId: 1065,
                      dataTextId: 1064,
                      typeLabel: 'DropDownListbox',
                      style: null,
                      ordinal: '0'
                    }
                  ],
                  ordinal: '0'
                }
              ],
              style: '{ "flexDirection": "column" }'
            },
            viewModel: {
              id: '11e8-16b1-16bb0d60-bc6f-09406f2105f4',
              selectedChildViewId: '11e8-16b1-16bb3471-bc6f-09406f2105f4',
              isSelected: false,
              needsSaving: false,
              canBeDroppedOn: true,
              pageName: 'page1',
              style: '{ "flexDirection": "column" }',
              parentId: 'WEB_PAGE_ROOT',
              viewModel: {
                parentId: 1061,
                id: 1062,
                pageName: 'page1',
                typeLabel: 'Page',
                children: [
                  {
                    id: '11e8-16b1-16bb3470-bc6f-09406f2105f4',
                    isSelected: false,
                    canBeDroppedOn: true,
                    visibility: true,
                    parentId: '11e8-16b1-16bb0d60-bc6f-09406f2105f4',
                    viewModel: {
                      parentId: 1062,
                      id: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                      typeLabel: 'Div',
                      style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                      children: [
                        {
                          id: '11e8-16b1-16bb3471-bc6f-09406f2105f4',
                          elementId: 'Select-1',
                          dataStoreId: 1060,
                          dataModelId: 1063,
                          dataValueId: 1065,
                          dataTextId: 1064,
                          isSaveButtonDisabled: true,
                          canBeDroppedOn: false,
                          visibility: true,
                          parentId: '11e8-16b1-16bb3470-bc6f-09406f2105f4',
                          viewModel: {
                            parentId: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                            id: '11e8-16af-1e0dd130-9efe-99d9a0c0dbb8',
                            elementId: 'Select-1',
                            dataStoreId: 1060,
                            dataModelId: 1063,
                            dataValueId: 1065,
                            dataTextId: 1064,
                            typeLabel: 'DropDownListbox',
                            style: null,
                            ordinal: '0'
                          }
                        }
                      ],
                      ordinal: '0'
                    }
                  }
                ],
                style: '{ "flexDirection": "column" }'
              }
            }
          },
          title: 'Edit Website Page',
          className: 'pseudo-modal-edit-website-page'
        }
      ],
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
                    children: [
                      {
                        parentId: 1062,
                        id: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                        typeLabel: 'Div',
                        style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                        children: [
                          {
                            parentId: '11e8-16af-1c351990-9efe-99d9a0c0dbb8',
                            id: '11e8-16af-1e0dd130-9efe-99d9a0c0dbb8',
                            elementId: 'Select-1',
                            dataStoreId: 1060,
                            dataModelId: 1063,
                            dataValueId: 1065,
                            dataTextId: 1064,
                            typeLabel: 'DropDownListbox',
                            style: null,
                            ordinal: '0'
                          }
                        ],
                        ordinal: '0'
                      }
                    ],
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
                children: [
                  {
                    parentId: 1060,
                    id: 1063,
                    label: 'c',
                    typeLabel: 'DataModel',
                    userData: [
                      [
                        1067,
                        'red',
                        'kiwi'
                      ],
                      [
                        1066,
                        'bar',
                        'banana'
                      ]
                    ],
                    children: [
                      {
                        parentId: 1063,
                        id: 1064,
                        label: 'f1',
                        typeLabel: 'DataField',
                        children: []
                      },
                      {
                        parentId: 1063,
                        id: 1065,
                        label: 'f2',
                        typeLabel: 'DataField',
                        children: []
                      }
                    ]
                  }
                ]
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
    hasInitialStateBeenSaved: true,
    currentId: 1067
  }
};
