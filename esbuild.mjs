//@ts-check
import esbuild from 'esbuild';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import sassPlugin from './esbuild-sass-plugin.mjs';

/**
 * @param { 'app' | 'plugin' } mode
 */
export const buildWithEsbuild = async (mode) => {
  let entryPoints = [];
  if (mode === 'app') {
    const root = join(cwd(), 'src', 'apps');

    const allProjects = readdirSync(root);

    entryPoints = allProjects.reduce(
      /** @param { {in: string; out: string; }[] } acc */ (acc, dir) => {
        for (const filename of ['index.ts', 'index.js', 'index.mjs']) {
          if (existsSync(join(root, dir, filename))) {
            return [...acc, { in: join(root, dir, filename), out: dir }];
          }
        }
        return acc;
      },
      []
    );
  } else {
    entryPoints = ['desktop', 'config'].map((dir) => join('src', dir, 'index.ts'));
  }

  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    sourcemap: 'inline',
    platform: 'browser',
    outdir: join('dist', 'dev'),
    plugins: [
      {
        name: 'on-end',
        setup: ({ onEnd }) =>
          onEnd(() =>
            console.log(`[${new Date().toLocaleTimeString()}] [🐇 kbuild] 変更を反映しました`)
          ),
      },
      sassPlugin,
    ],
  });

  context.watch();
};
