import { SERVICES_PATH } from './constants';
import { readdirSync } from 'fs';
import IService from './IService';
import path from 'path';

class Services {
  static insances: { [key: string]: any } = {};

  static listAvailable: String[] = (() => {
    // TODO: implement scan of folder and return names
    return readdirSync(SERVICES_PATH, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name)
  })()

  static loadService = (serviceName: string, serviceConfig: Object = {}): any => {
    //TODO: implement init service by name and return instance
    // create singleton and return same instance on second call
    const exists = Services.checkServiceExist(serviceName);
    if (exists) {
      let instance = Services.insances[serviceName];
      if (!instance) {
        let service = require(`./${serviceName}`);
        instance = service.createService(serviceConfig);
        Services.insances[serviceName] = instance;
      }
      return instance;
    }
    return null;
  }

  static checkServiceExist = (serviceName: String): Boolean => {
    return Services.listAvailable.indexOf(serviceName) !== -1;
  }
}

export default Services;
