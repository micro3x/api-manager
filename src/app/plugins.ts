import path from 'path';
import pluginService from './pluginsService';
import { PLUGINS_PATH } from './constants';
import endpoints from './pluginsEndpoints';

const { readdirSync, readFileSync, existsSync } = require('fs');

const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name)

const init = (app: any, router: any) => {
  pluginService.init(app, router);
  getDirectories(PLUGINS_PATH).forEach((name: string) => {
    let manifestPath = path.resolve(PLUGINS_PATH, name, 'manifest.json');
    try {
      if (existsSync(manifestPath)) {
        let manifest = JSON.parse(readFileSync(manifestPath));
        pluginService.loadModuleFromManifest(manifest, path.resolve(PLUGINS_PATH, name));
      }
    } catch (err) {
      console.log(err);
    }
  });
  endpoints(app, router);
}

module.exports = {
  init
}
