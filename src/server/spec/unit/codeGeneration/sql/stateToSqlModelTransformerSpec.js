import stateToSqlModelTransformer from '../../../../codeGeneration/sql/stateToSqlModelTransformer';

describe('stateToSqlModelTransformer', () => {

  test('should transform record array and field definition.', async () => {
    // Arrange
    const usersDataArray = [['a', 'b', 'c']];
    const fieldArray = [
      {
        parentId: 1063,
        id: 1064,
        label: 'f1',
        typeLabel: 'DataField',
        children: []
      },
      {
        parentId: 1063,
        id: 1065,
        label: 'f2',
        typeLabel: 'DataField',
        children: []
      }
    ];

    // Act
    const insertionData = stateToSqlModelTransformer.transformUsersDataArray(fieldArray, usersDataArray);

    // Assert
    expect(true).toBe(!!insertionData);
    expect(insertionData[0].id).toBe('a');
    expect(insertionData[0].f1).toBe('b');
    expect(insertionData[0].f2).toBe('c');
  });
});

