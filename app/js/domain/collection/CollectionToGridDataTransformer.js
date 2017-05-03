import grid from './grid';

class CollectionToGridDataTransformer {

  transform(richOrbResult) {
    return {
      collectionId: richOrbResult.orbTypeInternalId,
      columns: this.getColumns(richOrbResult),
      rows: this.getRows(richOrbResult)
    };
  }

  getColumns(richOrbResult) {
    const columns = richOrbResult.fields.map((field) => (grid.constructColumn(field, field, true)));
    const idColumn = grid.constructColumnUsingRawName(grid.CONSTANTS.IDENTITY_KEY_NAME, grid.CONSTANTS.ID_DISPLAY_NAME, false);
    grid.addColumn(columns, idColumn);
    return columns;
  }

  getRows(richOrbResult) {
    const allRows = [];
    const orbList = richOrbResult.orbList;
    if (orbList !== null) {
      orbList.forEach((orb) => {
        const row = {};
        richOrbResult.fields.forEach((value, index) => {
          grid.addPropAndValueToRow(row, richOrbResult.fields[index], value);
        });
        grid.addPropAndValueToRow(row, grid.CONSTANTS.IDENTITY_KEY_NAME, orb.id);
        allRows.push(row);
      });
    }
    return allRows;
  }
}

export default new CollectionToGridDataTransformer();
