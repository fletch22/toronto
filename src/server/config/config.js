require('babel-core/register');
// import path from 'path';
const path = require('path');
// import srcRoot from '../../srcRoot';
const srcRoot = require('../../srcRoot');

class Config {
  constructor() {
    this.getTestOutputPath = this.getTestOutputPath.bind(this);
    this.getTestOuputFolderName = this.getTestOuputFolderName.bind(this);
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

export default new Config();

