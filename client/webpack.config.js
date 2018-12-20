const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./public/index.html",
    filename: "./index.html"
});

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/main.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                  loader: "file-loader",
                }
            }
        ]
    },
    plugins: [htmlPlugin],
    devtool: 'source-map',
    devServer: {
        compress: true,
        port: 8080,
        historyApiFallback: true,
        publicPath: '/'
    }
};