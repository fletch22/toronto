import stateTransformer from '../../../../server/codeGeneration/stateTranformer';
import { statePackageTest } from '../../statePackageTest';

describe('stateTransformer', () => {
  test('should get all the endpoints', () => {
    // Arrange
    // Act
    const serverAppModel = stateTransformer.stateToServerAppModelTransformer(statePackageTest.state.model);

    // Assert
    expect('ddlCollectionEndpoints' in serverAppModel).toBe(true);
    const endpoints = serverAppModel.ddlCollectionEndpoints;
    expect(endpoints.length).toBe(1);
    const c1 = endpoints[0];
    expect(c1.dataStoreLabel).toBe('default');
    expect(c1.collectionName).toBe('c1');
    expect(c1.dataValueField).toBe('f1');
    expect(c1.dataTextField).toBe('f2');
  });
});

