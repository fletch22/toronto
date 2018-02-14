import { expect } from 'chai';
import sqlDatabaseGeneratorService, { templateRoot, templateFilePath, targetProjectRoot } from '../../service/sqlDatabaseGeneratorService';
import path from 'path';
import shell from 'shelljs';

describe('sqlDatabaseGeneratorService', () => {
  it('should generate a template correctly.', () => {
    // Arrange
    // Act
    const text = sqlDatabaseGeneratorService.genenerate();



    // Assert
    expect(!!text).to.equal(true);
  });

  it('should get relative path correctly.', () => {
    // Arrange
    const templateBarPath = path.join(templateRoot, 'bar', 'banana.js.template');

    // Act
    const outputPath = sqlDatabaseGeneratorService.getOutputPath(templateBarPath);

    // Assert
    expect('D:\\workspaces\\toronto\\portUnion\\bar\\banana.js').to.equal(outputPath);
  });

  it('should write to output correctly.', async () => {
    // Arrange
    const content = sqlDatabaseGeneratorService.genenerate();

    c.l(`content: ${content}`);

    // Act
    const outputPath = await sqlDatabaseGeneratorService.sendOutput(templateFilePath, content);

    c.l(outputPath);

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
});

