(async () => {
  const esbuild = require('esbuild');
  const { existsSync, readdirSync } = require('fs');
  const { join } = require('path');
  const { cwd } = require('process');

  const root = join(cwd(), 'src', 'apps');

  const allProjects = readdirSync(root);

  const entryPoints = allProjects.reduce((acc, dir) => {
    for (const filename of ['index.ts', 'index.js', 'index.mjs']) {
      if (existsSync(join(root, dir, filename))) {
        return [...acc, { in: join(root, dir, filename), out: dir }];
      }
    }
    return acc;
  }, []);

  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    sourcemap: 'inline',
    platform: 'browser',
    outdir: join('dist', 'dev'),
    plugins: [
      {
        name: 'on-end',
        setup: ({ onEnd }) => onEnd(() => console.log('🐇 変更を反映しました')),
      },
    ],
  });

  context.watch();
})();