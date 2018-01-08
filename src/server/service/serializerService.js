import fileService from './fileService';

class SerializerService {

  toDisk(filepath, obj) {
    return fileService.persistByOverwritingSync(filepath, JSON.stringify(obj));
  }

  fromDisk(filepath) {
    return JSON.parse(fileService.readFile(filepath));
  }
}

export default new SerializerService();
