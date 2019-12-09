const path = require('path');
const BrotliPlugin = require('brotli-webpack-plugin')
module.exports = {

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'docuhelp.js'
  },

  plugins: [
		new BrotliPlugin({
			asset: '[path].br[query]',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8
		})
  ],

  optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},

  mode: 'production'
};