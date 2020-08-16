import IPluginManifest from "./IPluginManifest";

export enum EModuleStatus {
  Active = 'active',
  Inactive = 'inactive',
  Error = 'error'
}

export default interface IModule {
  manifest: IPluginManifest,
  status: EModuleStatus,
  error?: string
}
