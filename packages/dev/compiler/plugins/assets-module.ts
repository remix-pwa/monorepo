import type { OnLoadResult, OnResolveArgs, OnResolveResult, Plugin, PluginBuild } from 'esbuild';
import { glob } from 'glob';

import type { ResolvedWorkerConfig } from 'compiler/utils/config.js';

const FILTER_REGEX = /@remix-sas\/dev\?assets/;
const NAMESPACE = 'assets-module';

export default function assetsPlugin(config: ResolvedWorkerConfig): Plugin {
  async function setup(build: PluginBuild) {
    const onResolve = ({ path }: OnResolveArgs): OnResolveResult => ({
      path,
      namespace: NAMESPACE,
      watchDirs: [config.assetsBuildDirectory],
    });
    const onLoad = async (): Promise<OnLoadResult> => {
      const files = await glob(`**/*`, {
        ignore: '**/*.map',
        absolute: false,
        nodir: true,
        root: config.rootDirectory,
        cwd: config.assetsBuildDirectory,
      });

      const contents = `export const assets = ${JSON.stringify(files.map(file => `${config.publicPath}${file}`))};`;

      return {
        contents,
        resolveDir: config.appDirectory,
        loader: 'js',
      };
    };

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX, namespace: NAMESPACE }, onLoad);
  }

  return {
    name: 'sw-assets-module',
    setup,
  };
}
