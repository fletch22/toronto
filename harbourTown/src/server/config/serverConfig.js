require('babel-core/register');
const path = require('path');
const srcRoot = require('../../srcRoot');
import config from './config.js';

class ServerConfig {
  constructor() {
    this.getTestOutputPath = this.getTestOutputPath.bind(this);
    this.getTestOuputFolderName = this.getTestOuputFolderName.bind(this);

    this.databaseName = config.databaseName;
  }

  getTestOutputPath() {
    return path.join(srcRoot, '..', this.getTestOuputFolderName());
  }

  getTestOuputFolderName() {
    return 'dist';
  }

  getWebDevServerPort() {
    return 8081;
  }
}

export default new ServerConfig();

