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
        const row = {};
        richOrbResult.fields.forEach((value, index) => {
          gridHelper.addPropAndValueToRow(row, richOrbResult.fields[index], value);
        });
        gridHelper.addPropAndValueToRow(row, gridHelper.CONSTANTS.IDENTITY_KEY_NAME, orb.id);
        allRows.push(row);
      });
    }
    return allRows;
  }
}

export default new CollectionToGridDataTransformer();
