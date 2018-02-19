import Handlebars from 'handlebars';
import fileService from './fileService';
import path from 'path';
import winston from 'winston';
import { rootDir } from '../../../root';

export const targetProjectRoot = path.resolve(rootDir, 'portUnion');
export const templateRoot = path.join(targetProjectRoot, 'templates');
export const configJsonTemplatePath = path.join(templateRoot, 'config', 'config.json.template');
export const modelTemplatePath = path.join(templateRoot, 'models', 'model.js.template');

class SqlDatabaseGeneratorService {
  genenerate(state, filePath) {
    const source = this.readFile(filePath);
    const template = Handlebars.compile(source);

    return template(state);
  }

  getOutputPath(sourceTemplateFile) {
    const parentPath = path.dirname(sourceTemplateFile);
    const shortPath = parentPath.substring(templateRoot.length);
    const filename = path.basename(sourceTemplateFile);
    const templateExtension = path.extname(filename);
    const outputFilename = filename.slice(0, -(templateExtension.length));
    return path.join(targetProjectRoot, shortPath, outputFilename);
  }

  sendOutput(destinationPath, content) {
    return fileService.persistByOverwriting(destinationPath, content)
      .then(() => {
        return destinationPath;
      })
      .catch((error) => {
        winston.error(error.message);
        throw new Error(`Encountered error while trying to write '${destinationPath}'.`);
      });
  }

  readFile(filePath) {
    let source = '';
    if (fileService.exists(filePath)) {
      source = fileService.readFile(filePath);
    } else {
      throw new Error(`Encountered problem trying find file at '${filePath}'.`);
    }
    return source;
  }

  collectFiles() {
    return fileService.dir(templateRoot, (filename) => {
      return filename.endsWith('.template');
    });
  }
}

export default new SqlDatabaseGeneratorService();
