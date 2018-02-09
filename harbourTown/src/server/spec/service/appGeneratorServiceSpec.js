import { expect } from 'chai';
import appGeneratorService, { templateRoot, templateFilePath } from '../../service/appGeneratorService';
import path from 'path';

describe('appGeneratorService', () => {
  it('should generate a template correctly.', () => {
    // Arrange
    // Act
    const text = appGeneratorService.genenerate();

    // Assert
    expect(!!text).to.equal(true);
  });

  it('should get relative path correctly.', () => {
    // Arrange
    const templateBarPath = path.join(templateRoot, 'bar', 'banana.js.template');

    // Act
    const outputPath = appGeneratorService.getOutputPath(templateBarPath);

    // Assert
    expect('D:\\workspaces\\temp\\AwesomeProject\\bar\\banana.js').to.equal(outputPath);
  });

  it('should write to output correctly.', () => {
    // Arrange
    const content = appGeneratorService.genenerate();
    // Act
    appGeneratorService.sendOutput(templateFilePath, content);

    // Assert
  });
});

