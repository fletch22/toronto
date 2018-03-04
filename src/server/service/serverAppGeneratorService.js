import path from 'path';

import GeneratorService, { templateRoot } from './GeneratorService';


class ServerAppGeneratorService extends GeneratorService {
  async generateAndPersist(templateModel) {
    // Generate config
    const serverPath = path.join(templateRoot, 'src', 'server');

    const configTemplatePath = path.join(serverPath, 'config', 'config.js.template');
    await this.genSendOutput(templateModel.database, configTemplatePath);

    const userRoutesTemplatePath = path.join(templateRoot, 'src', 'server', 'userRoutes.js.template');
    await this.genSendOutput(templateModel, userRoutesTemplatePath);

    const modelsTemplatePath = path.join(templateRoot, 'src', 'server', 'models', 'modelFactory.js.template');
    await this.genSendOutput(templateModel.database, modelsTemplatePath);

    const entityServiceTemplatePath = path.join(templateRoot, 'src', 'server', 'service', 'entityService.js.template');
    await this.genSendOutput(templateModel.database, entityServiceTemplatePath);
  }

  async genSendOutput(model, configTemplatePath) {
    const outputFilePath = this.getOutputPath(configTemplatePath);
    const output = this.generate(model, configTemplatePath);
    await this.sendOutput(outputFilePath, output);
  }
}

export default new ServerAppGeneratorService();
