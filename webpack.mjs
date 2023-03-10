//@ts-check
import webpack from 'webpack';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { cwd } from 'process';
import TerserPlugin from 'terser-webpack-plugin';

/**
 * @param { 'app' | 'plugin' } mode
 */
export const buildWithWebpack = async (mode) => {
  const root = join(cwd(), 'src');
  /** @type { Record<string, string> } */
  let entry = {};
  if (mode === 'app') {
    const appsRoot = join(cwd(), 'src', 'apps');
    const allProjects = readdirSync(appsRoot);

    entry = allProjects.reduce((acc, dir) => {
      for (const filename of ['index.ts', 'index.js', 'index.mjs']) {
        if (existsSync(join(appsRoot, dir, filename))) {
          return { ...acc, [dir]: join(appsRoot, dir, filename) };
        }
      }
      return acc;
    }, {});
  } else {
    entry = {
      desktop: join(root, 'desktop', 'index.ts'),
      config: join(root, 'config', 'index.ts'),
    };
  }

  const exclude = /node_modules/;

  webpack(
    {
      mode: 'production',
      target: ['web', 'es2023'],
      entry,
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: { '@': resolve(cwd(), 'src') },
        fallback: {
          path: false,
        },
      },
      cache: { type: 'filesystem' },
      output: {
        filename: '[name].js',
        path: resolve(cwd(), 'dist', 'prod'),
      },
      module: {
        rules: [
          { test: /\.tsx?$/, exclude, loader: 'ts-loader' },
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              'css-loader',
              { loader: 'sass-loader', options: { sassOptions: { outputStyle: 'expanded' } } },
            ],
          },
        ],
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false })],
      },
    },
    (err, stats) => {
      if (err) {
        console.error(err);
      } else {
        if (stats?.compilation.errors.length) {
          console.error(`??? ???????????????????????????????????????????????????`);
          console.error(
            stats.compilation.errors.map((error) => [error.name, error.message, error.module])
          );
        } else {
          console.log(`???? ???????????????????????????????????????`);
        }
      }
    }
  );
};
