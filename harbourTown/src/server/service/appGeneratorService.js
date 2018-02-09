import Handlebars from 'handlebars';
import fileService from './fileService';
import path from 'path';
import winston from 'winston';

export const targetProjectRoot = 'D:\\workspaces\\temp\\AwesomeProject';
export const templateRoot = path.join(targetProjectRoot, 'templates');
export const templateFilePath = path.join(templateRoot, 'Foo.js.template');
class AppGeneratorService {

  genenerate() {
    const body = {
      body: 'banana'
    };

    const source = this.readFile(templateFilePath);
    const template = Handlebars.compile(source);

    return template(body);
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
    fileService.persistByOverwriting(destinationPath, content)
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
}

export default new AppGeneratorService();
