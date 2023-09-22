#!/usr/bin/env node
import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { parseArgs } from 'node:util';
import { buildWithEsbuild } from './esbuild.mjs';
import { buildWithWebpack } from './webpack.mjs';

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

console.log(
  chalk.bgHex('#15803d')(' kbuild ') +
    '   環境: ' +
    chalk.bold(env) +
    ', 実行モード: ' +
    chalk.bold(mode)
);
console.log();

if (env === 'dev') {
  buildWithEsbuild({ mode, srcRoot, distRoot: devRoot });
} else {
  buildWithWebpack({ mode, srcRoot, distRoot: prodRoot });
}
