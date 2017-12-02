import fs from 'fs';
import path from 'path';
import srcRoot from '../../srcRoot';

class PersistToDiskService {
  writeToFile(filePath, data) {
    c.l(`fp: ${filePath}`);
    return new Promise((resolve, reject) => {
      fs.open(filePath, 'a', (errOpen, fd) => {
        if (!errOpen) {
          fs.writeFile(fd, data, (err) => {
            // Force the file to be flushed
            if (!err) {
              fs.fdatasync(fd, () => {
                fs.close(fd, () => {
                  resolve();
                });
              });
            } else {
              console.log(`Error Message: ${err.message}`);
              reject(err);
            }
          });
        } else {
          console.log(`Error Message: ${errOpen.message}`);
          reject(errOpen);
        }
      });
    });
  }

  persistByOverwriting(filePath, data) {
    const options = { flag: 'w' };

    return new Promise((resolve, reject) => {
      return fs.writeFile(filePath, data, options, (err) => {
        if (!!err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  getPersistRootPath() {
    return path.resolve(srcRoot, '..', 'temp');
  }
}

export default new PersistToDiskService();
