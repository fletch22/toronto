import path from 'path';
import srcRoot from '../../srcRoot';

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

