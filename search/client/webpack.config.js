const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';

module.exports = {
  mode,
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'search.js',
    libraryTarget: 'this',
    library: ['myNamespace', 'search'],
  },
  plugins: [
    isProd &&
      new UglifyJsPlugin({
        cache: true,
      }),
  ].filter(Boolean),
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
