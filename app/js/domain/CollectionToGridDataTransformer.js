

class CollectionToGridDataTransformer {

  transform(richOrbResult) {
    return {
      columns: this.getColumns(richOrbResult),
      rows: this.getRows(richOrbResult)
    };
  }

  getColumns(richOrbResult) {
    return richOrbResult.fields.map((field) => ({ key: field, name: field }));
  }

  getRows(richOrbResult) {
    const allRows = [];
    const orbList = richOrbResult.orbList;
    if (orbList !== null) {
      orbList.forEach((orb) => {
        const row = {};
        richOrbResult.fields.forEach((value, index) => {
          row[richOrbResult.fields[index]] = 'foo';
        });
        allRows.push(row);
      });
    }
    return allRows;
  }
}

export default new CollectionToGridDataTransformer();
