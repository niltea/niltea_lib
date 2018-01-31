const path = require('path');
const webpack = require('webpack');

module.exports = [
	{
		entry: {
			util: './src/util.js',
		},
		output: {
			path      : path.join(__dirname, './build'),
			publicPath: '/js',
			filename  : '[name].js',
		},
		devServer: {
			contentBase: 'public',
		},
		module: {
			rules: [
				{
					test   : /\.js$/,
					exclude: /node_modules/,
					use    : 'babel-loader',
				},
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
			extensions: ['.js'],
		},
		plugins: [
			new webpack.optimize.OccurrenceOrderPlugin(),
			// new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } }),
			new webpack.optimize.AggressiveMergingPlugin(),
		],
	},
	{
		entry: {
			index: './src/index.ts',
		},
		output: {
			path    : path.join(__dirname, './build'),
			filename: '[name].js',
		},
		module: {
			rules: [
				{
					test   : /\.ts$/,
					exclude: /node_modules/,
					loader : 'ts-loader',
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		plugins: [
			new webpack.optimize.OccurrenceOrderPlugin(),
			// new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } }),
			new webpack.optimize.AggressiveMergingPlugin(),
		],
	},
];
