var path = require("path");
var webpack = require("webpack");

module.exports = function (env) {

	var pack = require("./package.json");
	var MiniCssExtractPlugin = require("mini-css-extract-plugin");

	var production = !!(env && env.production === "true");
	var asmodule = !!(env && env.module === "true");
	var standalone = !!(env && env.standalone === "true");

	// var babelSettings = {
	// 	extends: path.join(__dirname, ".babelrc")
	// };

	var outputFolder = "dist";

	var config = {
		mode: production ? "production" : "development",
		entry: {
			app: "./sources/app.js"
		},
		output: {
			path: path.join(__dirname, outputFolder),
			publicPath: "/" + outputFolder + "/",
			filename: "[name].js",
			chunkFilename: "[name].bundle.js"
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: "/node_modules/",
					// use: "babel-loader?" + JSON.stringify(babelSettings),
					use: "babel-loader"
				},
				{
					test: /\.(svg|png|jpg|jpeg|gif|ico)$/,
					// use: "url-loader?limit=25000"
					// use: ['file-loader?name=img/[name].[ext]']
					// include: path.join(__dirname, 'img'),
					// loader: 'url-loader',
					// query: {
					//   outputPath: path.join(__dirname, outputFolder, 'img'),
					//   publicPath: 'http://localhost:8080/',
					//   emitFile: true,
					// }
					// loader: 'file-loader?name=img/[name].[ext]',
					// options: {
					// 	outputPath: path.join(__dirname, outputFolder, 'img'),
					// }
					use: [
						"file-loader",
					],
				},
				{
					test: /\.(less|css)$/,
					use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
				}
			]
		},
		stats: "minimal",
		resolve: {
			extensions: [".js"],
			modules: ["./sources", "node_modules"],
			alias: {
				"jet-views": path.resolve(__dirname, "sources/views"),
				"jet-locales": path.resolve(__dirname, "sources/locales")
			}
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].css"
			}),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION: production,
				BUILD_AS_MODULE: (asmodule || standalone)
			}),
			new webpack.IgnorePlugin(/jet-locales/)
		],
		devServer: {
			stats: "errors-only",
			watchContentBase: true,
			contentBase: [
				__dirname,
				path.join(__dirname, outputFolder, "img"),
				path.join(__dirname, outputFolder, "fonts")
			],
			contentBasePublicPath: [
				"/",
				"/img",
				"/fonts",
			],

			proxy: {
				"/api/v1": {
					target: "http://dev2.im-dispatcher.ru/api/v1"
				}
			},
			port: 8080
		}
	};

	if (!production) {
		config.devtool = "inline-source-map";
	}

	if (asmodule) {
		if (!standalone) {
			config.externals = config.externals || {};
			config.externals = ["webix-jet"];
		}

		const out = config.output;
		const sub = standalone ? "full" : "module";

		out.library = pack.name.replace(/[^a-z0-9]/gi, "");
		out.libraryTarget = "umd";
		out.path = path.join(__dirname, "dist", sub);
		out.publicPath = "/dist/" + sub + "/";
	}

	return config;
}