import serializerService from '../../service/serializerService';
import sinon from 'sinon';
import fileService from '../../service/fileService';
import path from 'path';

describe('SerializerService', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should properly serialize an item to disk.', () => {
    // Arrange
    const filename = 'foo.txt';
    const filepath = 'someFilePath/bar/';
    const obj = {
      banana: 'itsripe'
    };

    const persistByOverWritingSyncStub = sandbox.stub(fileService, 'persistByOverwritingSync');

    const pathFile = path.join(filepath, filename);
    // Act
    serializerService.toDisk(pathFile, obj);

    // Act
    expect(persistByOverWritingSyncStub.calledOnce).toBe(true);

    const callArgs = persistByOverWritingSyncStub.getCall(0).args;
    const pathFileActual = callArgs[0];
    const stringBodyExpected = callArgs[1];

    expect(path.join(filepath, filename)).toEqual(pathFileActual);
    expect(stringBodyExpected).toEqual(JSON.stringify(obj));
  });

  it('should properly read file body from disk.', () => {
    // Arrange
    const filename = 'foo.txt';
    const filepath = 'someFilePath/bar/';
    const objExpected = {
      banana: 'itsripe'
    };

    const pathExpected = path.join(filepath, filename);
    const writtenString = JSON.stringify(objExpected);
    const fromDiskStub = sandbox.stub(fileService, 'readFile').returns(writtenString);

    // Act
    const objActual = serializerService.fromDisk(pathExpected);

    // Act
    expect(fromDiskStub.calledOnce).toBe(true);

    const callArgs = fromDiskStub.getCall(0).args;
    const pathFileActual = callArgs[0];

    expect(path.join(filepath, filename)).toEqual(pathFileActual);
    expect(JSON.stringify(objActual)).toEqual(writtenString);
  });
});
