import generatorService from '../../../service/GeneratorService';

describe('generatorService', () => {
  test('should map all the partials correctly', () => {
    // Arrange
    // Act
    const partialMap = generatorService.getPartialsMap();

    // Assert
    expect(!!partialMap).toBe(true);
    expect(!!partialMap.getCollectionEndpoint).toBe(true);
  });
});
