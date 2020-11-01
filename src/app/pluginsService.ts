import path from 'path';
import IPluginManifest, { IRoute } from './interfaces/IPluginManifest';
import IModule, { EModuleStatus } from './interfaces/IModule';
import { PLUGINS_PATH, MANIFEST_FILENAME } from './constants';
const { readFileSync, existsSync } = require('fs');
import Services from '../services';

class PluginsService {
  expressApp: any;
  expressRouter: any;
  private modules = [] as IModule[];
  init = (app: any, router: any) => {
    this.expressApp = app;
    this.expressRouter = router;
  }

  loadModule = (name: string) => {
    let { module } = this.getModule(name);
    if (module) {
      this.teardownModuleByName(name);
      this.removeModuleByName(name);
    }

    let manifestPath = path.resolve(PLUGINS_PATH, name, MANIFEST_FILENAME);
    if (existsSync(manifestPath)) {
      let manifest = <IPluginManifest>JSON.parse(readFileSync(manifestPath));
      this.loadModuleFromManifest(manifest, path.resolve(PLUGINS_PATH, name));
    } else {
      throw new Error('manifest does not exist.')
    }
  }

  loadModuleFromManifest = (manifest: IPluginManifest, folder: string) => {
    try {
      let rootPath = `/${manifest.name}`;
      let controller = require(path.resolve(folder, manifest.controller.filename));
      if (manifest.constructor?.entryFile) {
        import(path.resolve(folder, manifest.constructor.entryFile))
          .then(
            entry => {
              var dependencies: { [key: string]: any } = {};
              if (manifest.constructor?.dependencies && manifest.constructor.dependencies.length) {
                manifest.constructor.dependencies.forEach(dep => {
                  dependencies[dep.name] = Services.loadService(dep.name, dep.config);
                })
              }
              if (manifest.constructor?.entryFunction) {
                entry.default[manifest.constructor.entryFunction](dependencies || {});
              } else {
                entry.default(dependencies);
              }
            }
          )
      }

      manifest.controller.routes.forEach((route: IRoute) => {
        this.expressRouter[route.method](`${rootPath}/${route.name}`, controller[route.name])
      });
      this.modules.push({
        manifest,
        status: EModuleStatus.Active
      })
    } catch (err) {
      console.log(err);
      this.modules.push({
        manifest,
        status: EModuleStatus.Error,
        error: err
      })
    }
  }

  teardownModuleByName = (name: string): boolean => {
    const module = this.modules.find(m => m.manifest.name === name);
    if (module) {
      let moduleManifest = module.manifest;
      let rootPath = `/${moduleManifest.name}`;
      moduleManifest.controller.routes.forEach((route: IRoute) => {
        const routePath = `${rootPath}/${route.name}`;
        let routeIdx = this.expressRouter.stack.findIndex((r: any) => {
          let result = (
            r.route.path === routePath &&
            r.route.methods[route.method]
          )
          return result;
        })
        if (routeIdx > -1) {
          this.expressRouter.stack.splice(routeIdx, 1);
        }
      });
      console.log(this.expressRouter.stack);
      const idx = this.modules.indexOf(module);
      this.modules[idx] = {
        manifest: moduleManifest,
        status: EModuleStatus.Inactive
      }
      return true;
    }
    return false;
  }

  removeModuleByName = (name: string) => {
    let idx = this.modules.findIndex(m => m.manifest.name == name);
    this.modules.splice(idx, 1);
  }

  getModules = () => this.modules;

  getModule = (name: string): { module?: IModule, index: number } => {
    let idx = this.modules.findIndex(m => m.manifest.name == name)
    let module = idx < 0 ? undefined : this.modules[idx]
    return { module, index: idx }
  }
}

const service = new PluginsService();

export default service;
