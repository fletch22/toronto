import collectionToGridDataTransformer from '../../../domain/collection/collectionToGridDataTransformer';

describe('CollectionToGridDataTransformer', () => {
  it('should get the display columns correctly', () => {
    // Arrange
    const dataFields = [
      { label: 'column1' },
      { label: 'column2' },
      { label: 'column3' }
    ];

    // Act
    const columnsProcessed = collectionToGridDataTransformer.getColumns(dataFields);

    // Assert
    expect(!!columnsProcessed).to.be.equal(true);
    expect(Array.isArray(columnsProcessed)).to.be.equal(true);
    expect(columnsProcessed.length).to.be.equal(dataFields.length + 1);
    expect(columnsProcessed[1].name).to.be.equal(dataFields[0].label);
  });

  it('should get the display rows correctly', () => {
    // Arrange
    const dataFields = [
      { label: 'column1' },
      { label: 'column2' },
      { label: 'column3' }
    ];

    const collectionId = 123;

    const rowsRaw = [
      ['column1Value', 'column2Value', 'column3Value', 'column4Value']
    ];

    // Act
    const rows = collectionToGridDataTransformer.getRows(collectionId, rowsRaw, dataFields);

    // Assert
    expect(!!rows).to.be.equal(true);
    expect(Array.isArray(rows)).to.be.equal(true);
    expect(rows.length).to.be.equal(rowsRaw.length);
    expect(typeof rows[0].id).to.be.equal(typeof '');
  });
});
