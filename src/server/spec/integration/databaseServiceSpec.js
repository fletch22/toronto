import sequelize from 'sequelize';
import _ from 'lodash';
import databaseService from '../../service/databaseService';
import stringUtils from '../../../common/util/stringUtils';
import { statePackageTest } from './statePackageTest';
import databaseConstructionService from '../../service/databaseConstructionService';

const getDefine = () => {
  return {
    columnA: {
      type: sequelize.BOOLEAN,
      validate: {
        is: ['[a-z]', 'i'],        // will only allow letters
        max: 23,                  // only allow values <= 23
        isIn: {
          args: [['en', 'zh']],
          msg: 'Must be English or Chinese'
        }
      },
      field: 'column_a'
      // Other attributes here
    },
    columnB: sequelize.STRING,
    columnC: sequelize.STRING
  };
};

describe('databaseServiceSpec', () => {
  const sampleDbNames = [];

  const getSampleDbName = () => {
    const rndString = stringUtils.getRandomString(6, true);
    const dbName = `f22_${rndString}`;
    sampleDbNames.push(dbName);

    return dbName;
  };

  // afterAll(() => {
  //   sampleDbNames.forEach(async (name) => {
  //     c.l(`Deleting this db ${name} ...`);
  //     await databaseService.dropDatabase(name);
  //   });
  // });

  // test('should test databases connection', (done) => {
  //   databaseService.testConnection()
  //     .then(() => {
  //       done();
  //     });
  // });
  //
  // test('should create database', async () => {
  //   // Arrange
  //   const sampleDbName = getSampleDbName();
  //
  //   // Act
  //   await databaseService.createDatabase(sampleDbName);
  //
  //   // Assert
  //   const databaseList = await databaseService.listDatabases();
  //
  //   expect(databaseList.includes(sampleDbName)).toBe(true);
  // });
  //
  // test('should list databases', async () => {
  //   // Arrange
  //   // Act
  //   const databaseSchemas = await databaseService.listDatabases();
  //
  //   // Assert
  //   expect(!!databaseSchemas).not.toBe(false);
  // });
  //
  // test('should drop selected databases', async () => {
  //   // Arrange
  //   const sampleDbName = getSampleDbName();
  //   await databaseService.createDatabase(sampleDbName);
  //
  //   // Act
  //   await databaseService.dropDatabase(sampleDbName);
  //
  //   // Assert
  //   const databaseSchemas = await databaseService.listDatabases();
  //   expect(!!databaseSchemas.includes(sampleDbName)).toBe(false);
  // });
  //
  // test('should open a database connection', async () => {
  //   // Arrange
  //   const sampleDbName = getSampleDbName();
  //   await databaseService.createDatabase(sampleDbName);
  //
  //   // Act
  //   databaseService.openConnection(sampleDbName);
  //
  //   // Assert
  //   databaseService.openConnection('mysql');
  // });
  //
  // test('should create the schema', async () => {
  //   // Arrange
  //   const sampleDbName = getSampleDbName();
  //   await databaseService.createDatabase(sampleDbName);
  //   databaseService.openConnection(sampleDbName);
  //
  //   databaseService.define('foo', getDefine());
  //
  //   // Act
  //   await databaseService.sync();
  //
  //   // Assert
  //   databaseService.openConnection('mysql');
  // });

  test('should transform state to create database model successfully.', async () => {
    // Arrange
    const databaseName = `f22_${stringUtils.replaceAll(statePackageTest.CLIENT_ID_dk89h22njkfdu90jo21kl231kl2199, '-', '_')}`;

    // Act
    await databaseService.dropDatabase(databaseName);
    await databaseConstructionService.createDatabaseFromState(statePackageTest);

    // Assert
  });

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
    const insertionData = databaseConstructionService.transformUsersDataArray(fieldArray, usersDataArray);

    // Assert
    expect(true).toBe(!!insertionData);
    expect(insertionData[0].id).toBe('a');
    expect(insertionData[0].f1).toBe('b');
    expect(insertionData[0].f2).toBe('c');
  });

  test('should insert a record.', () => {
    // Arrange
    // Act
    // Assert
  });
});

