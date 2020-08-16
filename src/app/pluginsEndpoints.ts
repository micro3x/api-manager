import pluginService from './pluginsService';

export default function initEndpoints(app: any, router: any) {
  const rootPath = '/api/plugins';

  app.get(rootPath, function (req: any, res: any) {
    res.send(pluginService.getModules());
  })

  app.post(rootPath, function (req: any, res: any) {
    let names = req.body as string[];
    let result = [] as any[];
    names.forEach(name => {
      try {
        pluginService.loadModule(name);
        result.push({ name, status: 'success' })
      } catch (err) {
        result.push({ name, status: 'fail' })
      }
    })
    res.send(result)
  });

  app.delete(`${rootPath}/:name`, function (req: any, res: any) {
    let name = req.params['name'] as string;
    let result = pluginService.teardownModuleByName(name);
    res.send({ status: result ? "success" : "fail" })
  })
}
