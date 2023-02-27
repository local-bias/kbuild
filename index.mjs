#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { buildWithEsbuild } from './esbuild.mjs';
import { buildWithWebpack } from './webpack.mjs';

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
  },
  allowPositionals: true,
});

const env = option.positionals[0] ?? option.values.env;
const mode = option.positionals[1] ?? option.values.mode;

console.log('🐇 kbuild');
console.table({ 環境: env, 実行モード: mode });

if (env === 'dev') {
  buildWithEsbuild(mode);
} else {
  buildWithWebpack(mode);
}
