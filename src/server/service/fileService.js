import fs from 'fs';
import path from 'path';
import srcRoot from '../../srcRoot';
import winston from 'winston';
import readline from 'readline';
import rimraf from 'rimraf';

const defaultEncoding = 'utf8';

class FileService {
  persistByAppending(filePath, data) {
    return new Promise((resolve, reject) => {
      fs.open(filePath, 'a', (errOpen, fd) => {
        if (!errOpen) {
          fs.writeFile(fd, data, (err) => {
            // Force the file to be flushed
            if (!err) {
              fs.fdatasync(fd, () => {
                fs.close(fd, () => {
                  resolve(data);
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

  persistByOverwritingSync(filepath, dataString) {
    fs.writeFileSync(filepath, dataString);
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

  exists(thingPath) {
    return fs.existsSync(thingPath);
  }

  removeFolder(thingPath) {
    return rimraf.sync(thingPath);
  }

  makeFolder(thingPath) {
    return fs.mkdirSync(thingPath);
  }

  copy(sourcePath, destinationPath) {
    console.log(`About to attempt to copy ${destinationPath}`);
    fs.copyFileSync(sourcePath, destinationPath);
  }

  readFile(filepath) {
    return fs.readFileSync(filepath, defaultEncoding);
  }

  getFolderName(pathThing) {
    return path.dirname(pathThing).split(path.sep).pop();
  }

  getFolderContentNames(pathThing) {
    return fs.readdirSync(pathThing);
  }

  dir(folderPath, fnFilter) {
    const list = fs.readdirSync(folderPath);

    let matchList = [];
    if (Array.isArray(list)) {
      list.forEach((item) => {
        const itemPath = path.join(folderPath, item);
        const stat = fs.statSync(itemPath);
        if (stat && stat.isDirectory()) {
          const resultList = this.dir(itemPath, fnFilter);
          matchList = matchList.concat(resultList);
        } else {
          if (!!fnFilter) {
            if (fnFilter(itemPath)) {
              matchList.push(itemPath);
            }
          } else {
            matchList.push(itemPath);
          }
        }
      });
    }

    return matchList;
  }
}

export default new FileService();
