export interface IRoute {
  method: string;
  name: string;
}

export interface IPluginManifestController {
  filename: string;
  routes: [IRoute];
}

interface IPluginManifest {
  name: string;
  controller: IPluginManifestController;
}

export default IPluginManifest;
