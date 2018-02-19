import Sequelize from 'sequelize';
import databaseService from '../../service/databaseService';
import stringUtils from '../../../common/util/stringUtils';

const getDefine = () => {
  return {
    columnA: {
      type: Sequelize.BOOLEAN,
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
    columnB: Sequelize.STRING,
    columnC: Sequelize.STRING
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

  afterAll(() => {
    sampleDbNames.forEach(async (name) => {
      c.l(`Deleting this db ${name} ...`);
      await databaseService.dropDatabase(name);
    });
  });

  test('should test databases connection', (done) => {
    databaseService.testConnection()
      .then(() => {
        done();
      });
  });

  test('should create database', async () => {
    // Arrange
    const sampleDbName = getSampleDbName();

    // Act
    await databaseService.createDatabase(sampleDbName);

    // Assert
    const databaseList = await databaseService.listDatabases();

    expect(databaseList.includes(sampleDbName)).toBe(true);
  });

  test('should list databases', async () => {
    // Arrange
    // Act
    const databaseSchemas = await databaseService.listDatabases();

    // Assert
    expect(!!databaseSchemas).not.toBe(false);
  });

  test('should drop selected databases', async () => {
    // Arrange
    const sampleDbName = getSampleDbName();
    await databaseService.createDatabase(sampleDbName);

    // Act
    await databaseService.dropDatabase(sampleDbName);

    // Assert
    const databaseSchemas = await databaseService.listDatabases();
    expect(!!databaseSchemas.includes(sampleDbName)).toBe(false);
  });

  test('should open a database connection', async () => {
    // Arrange
    const sampleDbName = getSampleDbName();
    await databaseService.createDatabase(sampleDbName);

    // Act
    databaseService.openConnection(sampleDbName);

    // Assert
    databaseService.openConnection('mysql');
  });

  test('should create the schema', async () => {
    // Arrange
    const sampleDbName = getSampleDbName();
    await databaseService.createDatabase(sampleDbName);
    databaseService.openConnection(sampleDbName);

    databaseService.define('foo', getDefine());

    // Act
    await databaseService.sync();

    // Assert
    databaseService.openConnection('mysql');
  });
});

