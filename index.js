#!/usr/bin/env node
//@ts-check
const [env] = process.argv.slice(2);

if (env === 'dev') {
  require('./esbuild.dev');
} else {
  const webpack = require('webpack');
  const config = require('./webpack.config.js');
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
