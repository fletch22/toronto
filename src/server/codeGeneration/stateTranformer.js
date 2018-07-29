// @flow
import stateToSqlModelTransformer from './sql/stateToSqlModelTransformer';
import ComponentTypes from '../../common/domain/component/ComponentTypes';
import graphTraversal from '../../common/state/graphTraversal';
import type { SqlDatabaseModel } from './sql/stateToSqlModelTransformer';
import stateTraversal from '../../common/state/stateTraversal';

type DdlCollectionEndpoints = {
  dataStoreLabel: string,
  collectionName: string,
  dataValueField: string,
  dataTextField: string,
  collectionCallName: string
};

type DdlCollectionEndpointsWrapper = {
  ddlCollectionEndpoints: Array<DdlCollectionEndpoints>
};

type TemplateModel = {
  state: Object,
  database: SqlDatabaseModel,
  ddlCollectionEndpoints: Array<DdlCollectionEndpoints>,
  appModelString: string
};

class StateTranformer {
  transform(statePackage: Object): TemplateModel {
    const sqlDatabaseModel = stateToSqlModelTransformer.transform(statePackage);
    const state = statePackage.state;
    const model = state.model;
    const serverAppModel = this.stateToServerAppModelTransformer(model);

    const apps = stateTraversal.findAllWithTypeLabel(model, ComponentTypes.App);
    const helloWorldApp = apps.find((app) => app.label === 'HelloWorldApp');

    // c.lo(helloWorldApp, 'hwa: ');

    return {
      state,
      database: sqlDatabaseModel,
      ddlCollectionEndpoints: serverAppModel.ddlCollectionEndpoints,
      appModelString: JSON.stringify(helloWorldApp)
    };
  }

  stateToServerAppModelTransformer(stateModel: Object):DdlCollectionEndpointsWrapper {
    // Find all apps
    const apps = stateModel.appContainer.children.filter((child) => child.typeLabel === ComponentTypes.App);

    // NOTE: 2017-02-25: For MVP only process first app.
    const websites = apps[0].children.filter((child) => child.typeLabel === ComponentTypes.Website);

    // NOTE: 2017-02-25: For MVP only process first website.
    const webPages = graphTraversal.findByPropNameAndValue(websites[0], 'typeLabel', ComponentTypes.WebPage);

    // Find all websites in all apps.
    const ddls = graphTraversal.findByPropNameAndValue(webPages[0], 'typeLabel', ComponentTypes.DropDownListbox);

    // Find all pages in all apps
    const getCollectionEndpoints = [];
    ddls.forEach((item) => {
      getCollectionEndpoints.push(this.getDdlCollectionEndpoints(item, stateModel));
    });

    return {
      ddlCollectionEndpoints: getCollectionEndpoints
    };
  }

  getDdlCollectionEndpoints(ddl: Object, stateModel: Object): DdlCollectionEndpoints {
    const errorNotFound = new Error(`Encountered error while trying to find element related to ddl ${JSON.stringify(ddl)}`);

    const dataStore = graphTraversal.find(stateModel, ddl.dataStoreId);
    if (!dataStore) throw errorNotFound;
    const dataModel = graphTraversal.find(stateModel, ddl.dataModelId);
    if (!dataModel) throw errorNotFound;
    const dataValue = graphTraversal.find(stateModel, ddl.dataValueId);
    if (!dataValue) throw errorNotFound;
    const dataText = graphTraversal.find(stateModel, ddl.dataTextId);
    if (!dataText) throw errorNotFound;

    return {
      dataStoreLabel: dataStore.label,
      collectionName: dataModel.label,
      dataValueField: dataValue.label,
      dataTextField: dataText.label,
      collectionCallName: ddl.collectionCallName
    };
  }
}

export default new StateTranformer();
