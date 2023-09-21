/* eslint-disable */
const resolve = require("path").resolve;
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
    target: "node",
    mode: "production",
    node: {
        __dirname: false,
        __filename: false
    },
    plugins: [
        new Dotenv(),
        new webpack.ContextReplacementPlugin(/express\/lib/, resolve(__dirname, "../node_modules"), {
            ejs: "ejs"
        }),
        new CopyPlugin({
            patterns: [{ from: "static/certs/", to: "certs/" }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /index\.ts$/,
                loader: "string-replace-loader",
                options: {
                    search: "../static/certs/",
                    replace: "certs/",
                    flags: "g"
                }
            }
        ]
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        fallback: {
            "mongodb-client-encryption": false,
            aws4: false,
            snappy: false,
            "@aws-sdk/credential-providers": false,
            "@mongodb-js/zstd": false,
            kerberos: false
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    entry: ["./src/index.ts"],
    output: {
        filename: "index.js",
        path: resolve(__dirname, "build")
    }
};