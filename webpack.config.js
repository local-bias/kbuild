const { join, resolve } = require('path');
const { existsSync, readdirSync } = require('fs');
const { cwd } = require('process');
const TerserPlugin = require('terser-webpack-plugin');

const root = join(cwd(), 'src', 'apps');

const allProjects = readdirSync(root);

const entry = allProjects.reduce((acc, dir) => {
  for (const filename of ['index.ts', 'index.js', 'index.mjs']) {
    if (existsSync(join(root, dir, filename))) {
      return { ...acc, [dir]: join(root, dir, filename) };
    }
  }
  return acc;
}, {});

const exclude = /node_modules/;

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  target: ['web', 'es2023'],
  entry,
  cache: {
    type: 'filesystem',
    buildDependencies: { config: [__filename] },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: { '@': resolve(cwd(), 'src') },
    fallback: {
      path: false,
    },
  },
  output: {
    filename: '[name].js',
    path: resolve(cwd(), 'dist', 'prod'),
  },
  module: {
    rules: [{ test: /\.tsx?$/, exclude, loader: 'ts-loader' }],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
