export interface IRoute {
  method: string;
  name: string;
}

export interface IPluginManifestController {
  filename: string;
  routes: [IRoute];
}

export interface IDependencyService {
  name: string;
  config?: Object;
}

export interface IPluginManifestConstructor {
  entryFile: string;
  entryFunction?: string;
  dependencies?: [IDependencyService];
}

interface IPluginManifest {
  name: string;
  controller: IPluginManifestController;
  constructor?: IPluginManifestConstructor;
}

export default IPluginManifest;
