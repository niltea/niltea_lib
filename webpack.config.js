const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		index: './src/util.js',
	},
	output: {
		path    : path.join(__dirname, './dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test   : /\.js$/,
				exclude: /node_modules/,
				loader : 'eslint-loader',
				options: {
					comments   : false,
					fix        : true,
					failOnError: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['*', '.js'],
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } }),
		new webpack.optimize.AggressiveMergingPlugin(),
	],
};
