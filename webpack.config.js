const { join, resolve } = require('path');
const { existsSync, readdirSync } = require('fs');
const { cwd } = require('process');

const root = join(cwd(), 'src', 'apps');

const allProjects = readdirSync(root);

console.log({ __dirname, __filename });

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
  },
  output: {
    filename: '[name].js',
    path: resolve(cwd(), 'dist', 'prod'),
  },
  module: {
    rules: [{ test: /\.[jt]sx?$/, exclude, loader: 'ts-loader' }],
  },
  optimization: {
    minimize: true,
  },
};
