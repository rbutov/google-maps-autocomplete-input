const path = require('path');
const isPROD = JSON.parse(process.env.PROD_ENV || '0') === 1;
const pkg = require('./package.json');
const moduleName = `google-maps-autocomplete-input`;

module.exports = {
  mode: isPROD ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  optimization: {
    minimize: isPROD
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: isPROD ? `${moduleName}.min.js` : `${moduleName}.js`
  },
};