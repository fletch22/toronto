// @flow
import ComponentTypes, { WebPageDataFields } from 'common/domain/component/ComponentTypes';
import stateTraversal from 'common/state/stateTraversal';

type DataSourceField = {
  id: string | number,
  typeLabel: string,
  name: string
}

class DnDataSourceResolver {

  getDataReferences(dataSource): Array<DataSourceField> {
    let result = [];
    switch (dataSource.typeLabel) {
      case ComponentTypes.WebPage: {
        result = stateTraversal.findAllWithTypeLabels(dataSource, WebPageDataFields).map(field => ({
          id: field.id,
          typeLabel: field.typeLabel,
          name: field.elementId
        }));
        c.lo(result, 'result: ');
        break;
      }
      default: {
        throw new Error(`Encountered error while trying to get the data reference for an unhandled type ${dataSource.typeLabel}`);
      }
    }
    return result;
  }
}

export default new DnDataSourceResolver();
