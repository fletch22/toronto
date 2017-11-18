import gridHelper from './gridHelper';

class CollectionToGridDataTransformer {

  transform(richOrbResult) {
    return {
      collectionId: richOrbResult.orbTypeInternalId,
      columns: this.getColumns(richOrbResult),
      rows: this.getRows(richOrbResult)
    };
  }

  getColumns(richOrbResult) {
    const columns = richOrbResult.fields.map((field) => (gridHelper.constructColumn(field, field, true)));
    const idColumn = gridHelper.constructKeyColumn(gridHelper.CONSTANTS.IDENTITY_KEY_NAME, gridHelper.CONSTANTS.ID_DISPLAY_NAME);
    gridHelper.addColumn(columns, idColumn);
    return columns;
  }

  getRows(richOrbResult) {
    const allRows = [];
    const orbList = richOrbResult.orbList;
    if (orbList !== null) {
      orbList.forEach((orb) => {
        let row = {};
        /* eslint-disable guard-for-in */
        for (const property in orb.userDefinedProperties) {
          const value = orb.userDefinedProperties[property];
          row = gridHelper.addPropAndValueToRow(row, gridHelper.constructColumnName(property), value);
        }
        gridHelper.addPropAndValueToRow(row, gridHelper.CONSTANTS.IDENTITY_KEY_NAME, orb.orbInternalId);
        allRows.push(row);
      });
    }
    return allRows;
  }
}

export default new CollectionToGridDataTransformer();
