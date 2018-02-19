import { expect } from 'chai';
import mobileAppGeneratorService, { templateRoot, templateFilePath } from '../../../service/mobileAppGeneratorService';
import path from 'path';

describe.skip('mobileAppGeneratorService', () => {
  it('should generate a template correctly.', () => {
    // Arrange
    // Act
    const text = mobileAppGeneratorService.genenerate();

    // Assert
    expect(!!text).to.equal(true);
  });

  it('should get relative path correctly.', () => {
    // Arrange
    const templateBarPath = path.join(templateRoot, 'bar', 'banana.js.template');

    // Act
    const outputPath = mobileAppGeneratorService.getOutputPath(templateBarPath);

    // Assert
    expect('D:\\workspaces\\temp\\AwesomeProject\\bar\\banana.js').to.equal(outputPath);
  });

  it('should write to output correctly.', () => {
    // Arrange
    const content = mobileAppGeneratorService.genenerate();
    // Act
    mobileAppGeneratorService.sendOutput(templateFilePath, content);

    // Assert
  });
});

