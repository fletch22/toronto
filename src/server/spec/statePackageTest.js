export const statePackageTest = {
  CLIENT_ID_dk89h22njkfdu90jo21kl231kl2199: '11e8-1a9b-b0d48190-b6f8-1fec543cb0ad',
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
      left: 451,
      top: 75,
      width: 70,
      height: 100,
      visible: true,
      lastUpdateRequest: 322,
      selectedElementId: '11e8-1a9b-5f061f90-b948-932b55afc6b8',
      selectedElementIndex: 0
    },
    views: [
      {
        id: '11e8-1a9b-59047ec0-b948-932b55afc6b8',
        viewModel: {
          children: [
            {
              id: '11e8-1a9b-5904a5d0-b948-932b55afc6b8',
              isTextInputFieldVisible: false,
              isShowingHeaderMenu: false,
              parentId: '11e8-1a9b-59047ec0-b948-932b55afc6b8',
              viewModel: {
                children: [
                  {
                    id: '11e8-1a9b-5904a5d1-b948-932b55afc6b8',
                    isTextInputFieldVisible: false,
                    isShowingHeaderMenu: false,
                    parentId: '11e8-1a9b-5904a5d0-b948-932b55afc6b8',
                    viewModel: {
                      parentId: 1057,
                      id: 1058,
                      label: 'HelloWorldApp',
                      typeLabel: 'App',
                      children: [
                        {
                          id: '11e8-1a9b-5904a5d2-b948-932b55afc6b8',
                          isTextInputFieldVisible: false,
                          isShowingHeaderMenu: false,
                          parentId: '11e8-1a9b-5904a5d1-b948-932b55afc6b8',
                          viewModel: {
                            parentId: 1058,
                            id: 1061,
                            label: 'website1',
                            typeLabel: 'Website',
                            children: [
                              {
                                id: '11e8-1a9b-5904a5d3-b948-932b55afc6b8',
                                isTextInputFieldVisible: false,
                                isShowingHeaderMenu: false,
                                parentId: '11e8-1a9b-5904a5d2-b948-932b55afc6b8',
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
          id: '11e8-1a9b-5a241f91-b948-932b55afc6b8',
          viewName: 'EDIT_WEBSITE_PAGE_DETAILS',
          data: {
            modelNodeId: 1062,
            parentModelNodeId: 1061,
            id: '11e8-1a9b-5a241f90-b948-932b55afc6b8',
            model: {
              parentId: 1061,
              id: 1062,
              pageName: 'page1',
              typeLabel: 'Page',
              children: [],
              style: '{ "flexDirection": "column" }'
            },
            viewModel: {
              id: '11e8-1a9b-5a23f880-b948-932b55afc6b8',
              selectedChildViewId: '11e8-1a9b-5f061f90-b948-932b55afc6b8',
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
                    id: '11e8-1a9b-5a837da1-b948-932b55afc6b8',
                    isSelected: false,
                    canBeDroppedOn: true,
                    visibility: true,
                    parentId: '11e8-1a9b-5a23f880-b948-932b55afc6b8',
                    viewModel: {
                      parentId: 1062,
                      id: 1063,
                      typeLabel: 'Div',
                      style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                      children: [
                        {
                          id: '11e8-1a9b-5c2546c1-b948-932b55afc6b8',
                          isSelected: false,
                          canBeDroppedOn: true,
                          visibility: true,
                          parentId: '11e8-1a9b-5a837da1-b948-932b55afc6b8',
                          viewModel: {
                            parentId: 1063,
                            id: 1064,
                            typeLabel: 'Div',
                            style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                            children: [
                              {
                                id: '11e8-1a9b-5f061f90-b948-932b55afc6b8',
                                elementId: 'Select-1',
                                dataStoreId: 1060,
                                dataModelId: 1067,
                                dataValueId: 1068,
                                dataTextId: 1069,
                                isSaveButtonDisabled: true,
                                canBeDroppedOn: false,
                                visibility: true,
                                parentId: '11e8-1a9b-5c2546c1-b948-932b55afc6b8',
                                viewModel: {
                                  parentId: 1064,
                                  id: 1066,
                                  elementId: 'Select-1',
                                  dataStoreId: 1060,
                                  dataModelId: 1067,
                                  dataValueId: 1068,
                                  dataTextId: 1069,
                                  typeLabel: 'DropDownListbox',
                                  style: null,
                                  ordinal: '0'
                                }
                              }
                            ],
                            ordinal: '0'
                          }
                        },
                        {
                          id: '11e8-1a9b-5d55d781-b948-932b55afc6b8',
                          isSelected: false,
                          canBeDroppedOn: true,
                          visibility: true,
                          parentId: '11e8-1a9b-5a837da1-b948-932b55afc6b8',
                          viewModel: {
                            parentId: 1063,
                            id: 1065,
                            typeLabel: 'Div',
                            style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                            children: [],
                            ordinal: '1'
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
                        id: 1063,
                        typeLabel: 'Div',
                        style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                        children: [
                          {
                            parentId: 1063,
                            id: 1064,
                            typeLabel: 'Div',
                            style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                            children: [
                              {
                                parentId: 1064,
                                id: 1066,
                                elementId: 'Select-1',
                                dataStoreId: 1060,
                                dataModelId: 1067,
                                dataValueId: 1068,
                                dataTextId: 1069,
                                typeLabel: 'DropDownListbox',
                                style: null,
                                ordinal: '0'
                              }
                            ],
                            ordinal: '0'
                          },
                          {
                            parentId: 1063,
                            id: 1065,
                            typeLabel: 'Div',
                            style: '{"boxShadow":"inset 0px 0px 0px 1px gray","boxSizing":"border-box","minWidth":"100px","minHeight":"100px"}',
                            children: [],
                            ordinal: '1'
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
                    id: 1067,
                    label: 'c1',
                    typeLabel: 'DataModel',
                    userData: [
                      [
                        1069,
                        '123231',
                        'asd'
                      ],
                      [
                        1069,
                        'asdf'
                      ]
                    ],
                    children: [
                      {
                        parentId: 1067,
                        id: 1068,
                        label: 'f1',
                        typeLabel: 'DataField',
                        children: []
                      },
                      {
                        parentId: 1067,
                        id: 1069,
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
    currentId: 1069
  }
};