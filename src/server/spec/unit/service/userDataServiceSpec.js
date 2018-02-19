import userDataService from '../../../service/userDataService';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

describe('userDataService', () => {
  const state = {
    model: {
      appContainer: {
        children: [
          {
            typeLabel: ComponentTypes.DataUniverse,
            children: [
              {
                typeLabel: ComponentTypes.Datastore,
                label: 'default',
                children: [
                  {
                    typeLabel: ComponentTypes.DataModel,
                    id: 123
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };

  test('should get the DataUniverse from state.', () => {
    // Arrange
    const id = 'foo';

    // Act
    const dataUniverse = userDataService.getDataUniverse(state);

    // Assert
    expect(typeof dataUniverse).not.toEqual(typeof undefined);
  });

  test('should get the DataStore from state.', () => {
    // Arrange
    // Act
    const dataStore = userDataService.getDataStoreBy('label', 'default', state);

    // Assert
    expect(typeof dataStore).toEqual(typeof {});
    expect(dataStore.label === 'default');
  });

  test('should get the DataModel from state.', () => {
    // Arrange
    const id = 123;

    const dataStore = userDataService.getDataStoreBy('label', 'default', state);

    // Act
    const dataModel = userDataService.getDataModelBy('id', 123, dataStore);

    // Assert
    expect(typeof dataModel).toEqual(typeof {});
    expect(dataModel.id === id);
  });
});
