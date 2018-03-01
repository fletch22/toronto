import stateTransformer from '../../../codeGeneration/stateTranformer';
import { statePackageTest } from '../../statePackageTest';
import serverAppGeneratorService from '../../../service/serverAppGeneratorService';

describe('serverAppGeneratorService', () => {
  test('should generate the server app correctly.', async () => {
    // Arrange
    const templateModel = stateTransformer.transform(statePackageTest);

    // Act
    await serverAppGeneratorService.generateAndPersist(templateModel);

    // Assert
    expect(true).toBe(true);
  });
});
