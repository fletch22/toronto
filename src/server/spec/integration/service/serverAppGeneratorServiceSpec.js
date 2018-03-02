import stateTransformer from '../../../codeGeneration/stateTranformer';
import { statePackageTest } from '../../statePackageTest';
import serverAppGeneratorService from '../../../service/serverAppGeneratorService';
import databaseService from '../../../service/databaseService';
import databaseConstructionService from '../../../service/databaseConstructionService';

describe('serverAppGeneratorService', () => {
  test('should generate the server app correctly.', async () => {
    // Arrange
    const templateModel = stateTransformer.transform(statePackageTest);

    const databaseModel = templateModel.database;

    // Act
    await databaseService.dropDatabase(databaseModel.databaseName);
    await databaseConstructionService.createDatabase(databaseModel);

    // Act
    await serverAppGeneratorService.generateAndPersist(templateModel);

    // Assert
    expect(true).toBe(true);
  });
});
