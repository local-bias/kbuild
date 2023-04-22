#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { buildWithEsbuild } from './esbuild.mjs';
import { buildWithWebpack } from './webpack.mjs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const DEFAULT_SRC_ROOT = 'src';

const option = parseArgs({
  options: {
    env: {
      type: 'string',
      default: 'prod',
    },
    mode: {
      type: 'string',
      default: 'app',
      short: 'm',
    },
    'src-root': {
      type: 'string',
      default: DEFAULT_SRC_ROOT,
    },
    'dev-root': {
      type: 'string',
      default: 'dist/dev',
    },
    'prod-root': {
      type: 'string',
      default: 'dist/prod',
    },
  },
  allowPositionals: true,
});

const env = option.positionals[0] ?? option.values.env;
const mode = option.positionals[1] ?? option.values.mode;
const srcRoot = option.values['src-root'];
const devRoot = option.values['dev-root'];
const prodRoot = option.values['prod-root'];

if (!existsSync(join(cwd(), srcRoot))) {
  console.error(`🚨 ${srcRoot} ディレクトリが存在しません`);
  console.info(`ソースファイルのディレクトリは--src-rootオプションで指定できます`);
  process.exit(1);
}

console.log('🐇 kbuild');
console.table({ 環境: env, 実行モード: mode });

if (env === 'dev') {
  buildWithEsbuild({ mode, srcRoot, distRoot: devRoot });
} else {
  buildWithWebpack({ mode, srcRoot, distRoot: prodRoot });
}
