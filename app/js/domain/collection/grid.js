
class Grid {

  constructor() {
    this.CONSTANTS = {
      IDENTITY_KEY_NAME: 'id',
      ID_DISPLAY_NAME: 'ID',
      COLUMN_SAFETY_PREFIX: '_this_value_prevents_name_collisions_AGX123_',
      NEW_ID_VALUE: '-'
    };
  }

  addNewRow(columns, rows) {
    const newRow = {};
    columns.forEach((col) => {
      this.addPropAndValueToRow(newRow, col.key, '');
    });
    this.addPropAndValueToRow(newRow, this.CONSTANTS.IDENTITY_KEY_NAME, this.CONSTANTS.NEW_ID_VALUE);
    rows.unshift(newRow);
  }

  addPropAndValueToRow(row, columnName, value) {
    /* eslint-disable no-param-reassign */
    row[columnName] = value;
  }

  addColumn(columns, newColumn) {
    columns.unshift(newColumn);
  }

  constructColumn(rawColumnName, name, isEditable) {
    return { key: this.constructColumnName(rawColumnName), name, editable: isEditable };
  }

  constructColumnUsingRawName(rawColumnName, name, isEditable) {
    return { key: rawColumnName, name, editable: isEditable };
  }

  constructColumnName(rawColumnName) {
    return `${this.CONSTANTS.COLUMN_SAFETY_PREFIX}${rawColumnName}`;
  }
}

export default new Grid();




