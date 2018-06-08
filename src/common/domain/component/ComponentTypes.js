const ComponentTypes = {
  AppContainer: 'AppContainer',
  App: 'App',
  ButtonSubmit: 'ButtonSubmit',
  Datastore: 'Datastore',
  DnBrowser: 'DnBrowser',
  DnConnector: 'DnConnector',
  DnConnectorInNexus: 'DnConnectorInNexus',
  DnConnectorOutNexus: 'DnConnectorOutNexus',
  DnWebServer: 'DnWebServer',
  DnDataStore: 'DnDataStore',
  DnTransferCase: 'DnTransferCase',
  DnTransferFieldMapper: 'DnTransferFieldMapper',
  DnTransferSourceField: 'DnTransferSourceField',
  DnTransferTargetField: 'DnTransferTargetField',
  DataModel: 'DataModel',
  DataField: 'DataField',
  DataUniverse: 'DataUniverse',
  Website: 'Website',
  WebFolder: 'WebFolder',
  WebPage: 'Page',
  Layout: 'Layout',
  LayoutMinion: 'LayoutMinion',
  Div: 'Div',
  DropDownListbox: 'DropDownListbox',
  DataNarrative: 'DataNarratives',
  Cylinder: 'Cylinder'
};

export const ComponentTypesCollections = {
  DataNarrativeNexusNodes: [ComponentTypes.DnBrowser, ComponentTypes.DnWebServer, ComponentTypes.DnDataStore]
};

export default ComponentTypes;
