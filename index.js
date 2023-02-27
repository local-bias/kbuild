#!/usr/bin/env node

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
      console.log(`🐇 本番用ビルドが完了しました`);
    }
  });
}
