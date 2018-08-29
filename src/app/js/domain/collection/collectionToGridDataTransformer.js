import gridHelper from './gridHelper';
import f22Uuid from '../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

class CollectionToGridDataTransformer {

  // transform(richOrbResult) {
  //   return {
  //     collectionId: richOrbResult.orbTypeInternalId,
  //     columns: this.getColumns(richOrbResult),
  //     rows: this.getRows(richOrbResult)
  //   };
  // }

  transform(dataModel) {
    const userData = dataModel.userData;
    const dataFields = dataModel.children.filter((child) => child.typeLabel === ComponentTypes.DataField);

    return {
      collectionId: dataModel.id,
      columns: this.getColumns(dataFields),
      rows: this.getRows(dataModel.id, userData, dataFields)
    };
  }

  getColumns(dataFields) {
    const columns = dataFields.map((field) => {
      const label = field.label;
      return gridHelper.constructColumn(label, label, true);
    });
    const idColumn = gridHelper.constructKeyColumn(gridHelper.CONSTANTS.IDENTITY_KEY_NAME, gridHelper.CONSTANTS.ID_DISPLAY_NAME);
    gridHelper.addColumn(columns, idColumn);
    return columns;
  }

  getRows(collectionId, rowsRaw, dataFields) {
    const allRows = [];
    if (Array.isArray(rowsRaw)) {
      rowsRaw.forEach((singleRowRaw) => {
        let row = {};
        // c.l(`singleRowRaw: ${JSON.stringify(singleRowRaw)}`);
        dataFields.forEach((field, index) => {
          const columnNameRaw = field.label;
          row = gridHelper.addPropAndValueToRow(row, gridHelper.constructColumnName(columnNameRaw), singleRowRaw[index + 1]);
        });
        gridHelper.addPropAndValueToRow(row, gridHelper.CONSTANTS.IDENTITY_KEY_NAME, singleRowRaw[0]);
        allRows.push(row);
      });
    }
    return allRows;
  }
}

export default new CollectionToGridDataTransformer();
