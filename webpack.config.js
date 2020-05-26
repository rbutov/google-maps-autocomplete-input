const path = require('path');
const PROD = JSON.parse(process.env.PROD_ENV || '0') === 1;

module.exports = {
  mode: PROD ? 'production' : 'development',
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
    minimize: PROD
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: PROD ? 'google-maps-autocomplete-input.min.js' : 'google-maps-autocomplete-input.js'
  },
};