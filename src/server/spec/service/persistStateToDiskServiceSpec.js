import persistStateToDiskService from '../../service/persistStateToDiskService';
import persistToDiskService from '../../service/persistToDiskService';
import sinon from 'sinon';

describe('PersistStateDiskService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const countLines = (str) => {
    return str.replace(/[^\n]/g, '').length;
  };

  it('Should work correctly.', () => {
    // Arrange]
    const timestamp = new Date().getTime();
    console.log(timestamp);
    const states = [
      { foo: 'bar' },
      { foo: 'banana' },
      { foo: 'thing' }
    ];

    const persistGrouping = {
      1234567890: states,
      1234567891: states
    };

    const writeToFileStub = sandbox.stub(persistToDiskService, 'writeToFile');

    // Act
    persistStateToDiskService.groupAndWrite(persistGrouping);

    // Assert
    expect(writeToFileStub.callCount).toBe(2);

    const combinedLines = writeToFileStub.getCall(0).args[1];

    expect(countLines(combinedLines)).toBe(3);
  });

  it('Should create the filename part correctly', () => {
    // Arrange
    const timestamp1 = '1511114579664';
    const timestamp2 = (parseInt(timestamp1, 10) + 1).toString();
    const states = [
      { serverStartupTimestamp: timestamp1 },
      { serverStartupTimestamp: timestamp1 },
      { serverStartupTimestamp: timestamp2 }
    ];

    // Act
    const groupings = persistStateToDiskService.groupByTimestamp(states);

    const keys = [];
    for (const key in groupings) {
      if (groupings.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    // Assert
    expect(keys.length).toBe(2);
    expect(keys[0]).toBe(timestamp1);
    expect(keys[0]).toBe(timestamp1);
  });

  it('Should get the most recent historical state', (done) => {
    // Arrange
    // Act
    persistStateToDiskService.findMostRecentHistoricalState().then((result) => {
    // Assert
      c.lo(result, 'fmrhs: ');
      done();
    }).catch((err) => {
      throw new Error(err);
    });
  });
});
