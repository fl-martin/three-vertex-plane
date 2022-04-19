const path = require("path");

module.exports = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(png|jpe?g)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: "webpack-glsl-loader",
			},
		],
	},
	entry: "./src/index.js",
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		port: 9000,
	},
	devtool: "inline-source-map",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "images/[hash][ext][query]",
	},
};
