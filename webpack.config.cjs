/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        // Build JS/JSX using babel-loader
        // https://webpack.js.org/loaders/babel-loader/
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        // Build TS/TSX with ts-loader
        // https://webpack.js.org/guides/typescript/
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'ts-loader'
      },
      {
        // Build CSS with style-loader
        // https://webpack.js.org/loaders/style-loader/
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      querystring: require.resolve('query-string')
    }
  },
  output: {
    // Output to `dist/` directory
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    // Configure devServer to refresh when files are modified and
    //   fix issues with refreshing the page on a non-root url
    port: 3000,
    hot: 'only',
    historyApiFallback: true
  },
  plugins: [
    // Build dist/index.html from src/index.ejs using html-webpack-plugin
    // https://webpack.js.org/plugins/html-webpack-plugin/
    new HtmlWebpackPlugin({
      title: 'React Store',
      favicon: path.join(__dirname, 'public/favicon.svg'),
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    })
  ]
};
