import { expect } from 'chai';
import sqlDatabaseGeneratorService, { templateRoot, configJsonTemplatePath, modelTemplatePath } from '../../service/sqlDatabaseGeneratorService';
import path from 'path';
import randomstring from 'randomstring';

describe('sqlDatabaseGeneratorService', () => {
  // it('should generate a template correctly.', () => {
  //   // Arrange
  //   const databaseName = randomstring.generate({
  //     length: 6,
  //     charset: 'alphabetic',
  //     capitalization: 'lowercase'
  //   });
  //
  //   const state = {
  //     databaseName
  //   };
  //
  //   // Act
  //   const text = sqlDatabaseGeneratorService.genenerate(state, configJsonTemplate);
  //
  //   // Assert
  //   expect(!!text).to.equal(true);
  // });

  // it('should get relative path correctly.', () => {
  //   // Arrange
  //   const templateBarPath = path.join(templateRoot, 'bar', 'banana.js.template');
  //
  //   // Act
  //   const outputPath = sqlDatabaseGeneratorService.getOutputPath(templateBarPath);
  //
  //   // Assert
  //   expect('D:\\workspaces\\toronto\\portUnion\\bar\\banana.js').to.equal(outputPath);
  // });

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

  // it('should write to output correctly.', async () => {
  //   // Arrange
  //   const databaseName = randomstring.generate({
  //     length: 6,
  //     charset: 'alphabetic',
  //     capitalization: 'lowercase'
  //   });
  //
  //   const state = {
  //     databaseName
  //   };
  //
  //   const content = sqlDatabaseGeneratorService.genenerate(state, configJsonTemplate);
  //   const destinationPath = this.getOutputPath(configJsonTemplate);
  //
  //   // Act
  //   const outputPath = await sqlDatabaseGeneratorService.sendOutput(destinationPath, content);
  //
  //   // Assert
  //   expect(!!outputPath).to.equal(true);
  // });

  // it('should execute the shell command successfully.', () => {
  //   // Arrange
  //   // Active
  //   shell.cd(targetProjectRoot);
  //   shell.env.NODE_ENV = 'development';
  //
  //   if (shell.exec('npm run createDatabase').code !== 0) {
  //     shell.echo('Encountered failure while trying to create database.');
  //   }
  //
  //   // Assert
  // });

  test('should list the files.', () => {
    // Arrange
    // Act
    const files = sqlDatabaseGeneratorService.collectFiles();

    // Assert
    expect(files.length).to.equal(2);
  });
});

