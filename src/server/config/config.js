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
}

export default new Config();

