import _ from 'lodash';
import stateTraversal from '../../../../common/state/stateTraversal';

class GridHelper {

  constructor() {
    this.CONSTANTS = {
      IDENTITY_KEY_NAME: 'id',
      ID_DISPLAY_NAME: 'ID',
      COLUMN_SAFETY_PREFIX: '_this_value_prevents_name_collisions_AGX123_',
      NEW_ID_VALUE: '-'
    };
  }

  addNewRow(state, columns, rows) {
    const newRow = {};
    columns.forEach((col) => {
      this.addPropAndValueToRow(newRow, col.key, '');
    });

    this.addPropAndValueToRow(newRow, this.CONSTANTS.IDENTITY_KEY_NAME, stateTraversal.getNextId(state));

    rows.unshift(newRow);

    return rows;
  }

  addPropAndValueToRow(row, columnName, value) {
    /* eslint-disable no-param-reassign */
    row[columnName] = value;

    return row;
  }

  addColumn(columns, newColumn) {
    columns.unshift(newColumn);
  }

  constructColumn(rawColumnName, name, isEditable) {
    return { key: this.constructColumnName(rawColumnName), name, editable: isEditable };
  }

  constructKeyColumn(rawColumnName, name) {
    return { key: rawColumnName, name };
  }

  constructColumnName(rawColumnName) {
    return `${this.CONSTANTS.COLUMN_SAFETY_PREFIX}${rawColumnName}`;
  }

  convertRowToPersist(row) {
    return {
      id: row[this.CONSTANTS.IDENTITY_KEY_NAME],
      fields: this.getFieldsForPersist(row)
    };
  }

  getFieldsForPersist(row) {
    const clone = _.cloneDeep(row);
    delete clone[this.CONSTANTS.IDENTITY_KEY_NAME];

    const keys = Object.keys(clone);
    const attributes = {};
    keys.forEach((key) => {
      if (key !== this.CONSTANTS.IDENTITY_KEY_NAME) {
        const unprefixed = key.replace(new RegExp(this.CONSTANTS.COLUMN_SAFETY_PREFIX, 'g'), '');
        attributes[unprefixed] = clone[key];
      }
    });
    return attributes;
  }
}

export default new GridHelper();




