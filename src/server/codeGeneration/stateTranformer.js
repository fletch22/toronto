// @flow
import stateToSqlModelTransformer from './sql/stateToSqlModelTransformer';
import ComponentTypes from '../../common/domain/component/ComponentTypes';
import graphTraversal from '../../common/state/graphTraversal';
import type { SqlDatabaseModel } from './sql/stateToSqlModelTransformer';

type DdlCollectionEndpoints = {
  dataStoreLabel: string,
  collectionName: string,
  dataValueField: string,
  dataTextField: string
};

type DdlCollectionEndpointsWrapper = {
  ddlCollectionEndpoints: Array<DdlCollectionEndpoints>
};

type TemplateModel = {
  database: SqlDatabaseModel,
  ddlCollectionEndpoints: Array<DdlCollectionEndpoints>
};

class StateTranformer {
  transform(statePackage: Object): TemplateModel {
    const sqlDatabaseModel = stateToSqlModelTransformer.transform(statePackage);
    const serverAppModel = this.stateToServerAppModelTransformer(statePackage.state.model);

    return {
      database: sqlDatabaseModel,
      ddlCollectionEndpoints: serverAppModel.ddlCollectionEndpoints
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
    const ddls = graphTraversal.findByPropNameAndValue(webPages, 'typeLabel', ComponentTypes.DropDownListbox);

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
    return {
      dataStoreLabel: graphTraversal.find(stateModel, ddl.dataStoreId).label,
      collectionName: graphTraversal.find(stateModel, ddl.dataModelId).label,
      dataValueField: graphTraversal.find(stateModel, ddl.dataValueId).label,
      dataTextField: graphTraversal.find(stateModel, ddl.dataTextId).label
    };
  }
}

export default new StateTranformer();
