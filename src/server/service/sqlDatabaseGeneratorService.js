import Handlebars from 'handlebars';
import fileService from './fileService';
import path from 'path';
import winston from 'winston';
import randomstring from 'randomstring';

export const targetProjectRoot = 'D:\\workspaces\\toronto\\portUnion';
export const templateRoot = path.join(targetProjectRoot, 'templates');
export const templateFilePath = path.join(templateRoot, 'config', 'config.json.template');

class SqlDatabaseGeneratorService {
  genenerate() {
    const databaseName = randomstring.generate({
      length: 6,
      charset: 'alphabetic',
      capitalization: 'lowercase'
    });

    const state = {
      databaseName
    };

    const source = this.readFile(templateFilePath);
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

  sendOutput(sourceTemplateFile, content) {
    const destinationPath = this.getOutputPath(sourceTemplateFile);
    return fileService.persistByOverwriting(destinationPath, content)
      .then(() => {
        return destinationPath;
      })
      .catch((error) => {
        winston.error(error.message);
        throw new Error(`Encountered error while trying to write '${sourceTemplateFile}'.`);
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

  createDatabase() {

  }
}

export default new SqlDatabaseGeneratorService();
