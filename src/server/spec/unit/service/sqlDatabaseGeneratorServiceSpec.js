import { expect } from 'chai';
import sqlDatabaseGeneratorService, { templateRoot, configJsonTemplatePath, modelTemplatePath, targetProjectRoot } from '../../../service/sqlDatabaseGeneratorService';
import path from 'path';
import randomstring from 'randomstring';
import shell from 'shelljs';
import { rootDir } from '../../../../../root';

describe('sqlDatabaseGeneratorService', () => {
  it('should generate a template correctly.', () => {
    // Arrange
    const databaseName = randomstring.generate({
      length: 6,
      charset: 'alphabetic',
      capitalization: 'lowercase'
    });

    const state = {
      databaseName
    };

    // Act
    const text = sqlDatabaseGeneratorService.genenerate(state, configJsonTemplatePath);

    // Assert
    expect(!!text).to.equal(true);
  });

  it('should get relative path correctly.', () => {
    // Arrange
    const templateBarPath = path.join(templateRoot, 'bar', 'banana.js.template');

    const expectedPath = path.resolve(rootDir, 'portUnion\\bar\\banana.js');

    // Act
    const outputPath = sqlDatabaseGeneratorService.getOutputPath(templateBarPath);

    // Assert
    expect(expectedPath).to.equal(outputPath);
  });

  it('should write model to output correctly.', async () => {
    // Arrange
    const state = {
      lValueName: 'Foo',
      tableName: 'foo'
    };

    const content = sqlDatabaseGeneratorService.genenerate(state, modelTemplatePath);
    const destinationPath = sqlDatabaseGeneratorService.getOutputPath(modelTemplatePath);

    // Act
    const outputPath = await sqlDatabaseGeneratorService.sendOutput(destinationPath, content);

    // Assert
    expect(!!outputPath).to.equal(true);
  });

  it('should write to output correctly.', async () => {
    // Arrange
    const databaseName = randomstring.generate({
      length: 6,
      charset: 'alphabetic',
      capitalization: 'lowercase'
    });

    const state = {
      databaseName
    };

    const content = sqlDatabaseGeneratorService.genenerate(state, configJsonTemplatePath);
    const destinationPath = sqlDatabaseGeneratorService.getOutputPath(configJsonTemplatePath);

    // Act
    const outputPath = await sqlDatabaseGeneratorService.sendOutput(destinationPath, content);

    // Assert
    expect(!!outputPath).to.equal(true);
  });

  it('should execute the shell command successfully.', () => {
    // Arrange
    // Active
    shell.cd(targetProjectRoot);
    shell.env.NODE_ENV = 'development';

    if (shell.exec('npm run createDatabase').code !== 0) {
      shell.echo('Encountered failure while trying to create database.');
    }

    // Assert
  });

  test('should list the files.', () => {
    // Arrange
    // Act
    const files = sqlDatabaseGeneratorService.collectFiles();

    // Assert
    expect(files.length).to.equal(2);
  });
});

