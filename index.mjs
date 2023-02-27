#!/usr/bin/env node
import { parseArgs } from 'node:util';
import webpack from 'webpack';
import { run } from './esbuild.mjs';
import config from './webpack.config.js';

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

if (env === 'dev') {
  run(mode);
} else {
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      if (stats?.compilation.errors.length) {
        console.error(`⚠ 本番用ビルドでエラーが発生しました`);
        console.error(
          stats.compilation.errors.map((error) => [error.name, error.message, error.module])
        );
      } else {
        console.log(`🐇 本番用ビルドが完了しました`);
      }
    }
  });
}
