import fs from 'fs';
import path from 'path';
import srcRoot from '../../srcRoot';
import winston from 'winston/lib/winston';
import readline from 'readline';

class FileService {
  writeToFile(filePath, data) {
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
    const rootPath = path.resolve(srcRoot, '..', 'temp');
    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }
    return rootPath;
  }

  readFirstLine(filepath) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filepath)) {
        winston.info(`filepath found: ${filepath}`);
        const lineReader = this.createLineReadStream(filepath);

        let firstLine;
        lineReader.on('line', (line) => {
          if (!firstLine) {
            firstLine = line;
            lineReader.close();
          }
        });

        lineReader.on('close', () => {
          resolve(firstLine);
        });
      } else {
        reject(new Error(`Encountered problem trying to find file at '${filepath}'.`));
      }
    });
  }

  createLineReadStream(filepath) {
    return readline.createInterface({
      input: fs.createReadStream(filepath)
    });
  }

  rename(originalPath, newPath) {
    fs.renameSync(originalPath, newPath);
  }

  delete(filePath) {
    fs.unlinkSync(filePath);
  }
}

export default new FileService();
