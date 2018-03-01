import path from 'path';
import Handlebars from 'handlebars';
import winston from 'winston/lib/winston';
import fileService from './fileService';
import { rootDir } from '../../../root';


export const targetProjectRoot = path.resolve(rootDir, 'harbourTown');
export const templateRoot = path.join(targetProjectRoot, 'templates');

class GeneratorService {
  constructor() {
    const partialMap = this.getPartialsMap();
    Handlebars.registerPartial('getCollectionEndpoint', partialMap.getCollectionEndpoint);

    // NOTE: With the use of '~' this will output a new line when interating through arrays.
    // Example: {{iteratedBreak @root.someArray @index ~}}
    Handlebars.registerHelper('iteratedBreak', (array, index, options) => {
      return array.length - (index + 1) > 0 ? '\n' : '';
    });

    Handlebars.registerHelper('iteratedCommaSeparator', (obj, index, options) => {
      return Object.keys(obj).length - (index + 1) > 0 ? ',' : '';
    });

    Handlebars.registerHelper('capitalize', (context, index, options) => {
      return context.charAt(0).toUpperCase() + context.slice(1);
    });
  }

  generate(state, filePath) {
    const source = fileService.readFile(filePath);
    const template = Handlebars.compile(source);

    return template(state);
  }

  getOutputPath(sourceTemplateFileFullPath) {
    const parentPath = path.dirname(sourceTemplateFileFullPath);
    const shortPath = parentPath.substring(templateRoot.length);
    const filename = path.basename(sourceTemplateFileFullPath);
    const templateExtension = path.extname(filename);
    const outputFilename = filename.slice(0, -(templateExtension.length));
    return path.join(targetProjectRoot, shortPath, outputFilename);
  }

  getOutputPathParent(sourceTemplateFileFullPath) {
    const outputPath = this.getOutputPath(sourceTemplateFileFullPath);
    return path.dirname(outputPath);
  }

  sendOutput(destinationPath, content) {
    return fileService.persistByOverwriting(destinationPath, content)
      .then(() => destinationPath)
      .catch((error) => {
        winston.error(error.message);
        throw new Error(`Encountered error while trying to write '${destinationPath}'.`);
      });
  }

  getPartialRootPath() {
    return path.join(templateRoot, 'partials');
  }

  getPartialsMap() {
    const fileList = fileService.dir(this.getPartialRootPath());

    const fileMap = {};
    fileList.forEach((item) => {
      const templateContent = fileService.readFile(item);

      const filename = path.basename(item);

      // NOTE: 2017-02-26: Chops off every charater after the first period. E.g., 'foo.bar.template' becomes 'foo'.
      const key = filename.replace(/\.[^/.]+$/, '');
      fileMap[key] = templateContent;
    });

    return fileMap;
  }
}

export default GeneratorService;
