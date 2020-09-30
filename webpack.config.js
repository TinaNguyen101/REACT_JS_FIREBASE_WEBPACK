const path = require('path');
const webpack =require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VERDOR_LIBS =[
'bootstrap',
'jquery',
'lodash',
'react',
'react-dom'
];

const devServer = {
    port: 4000,
    open : true,
    disableHostCheck: true,
    historyApiFallback : true,
    overlay : true,
    stats : 'minimal',
    inline : true,
    compress : true,
    contentBase : '/'
};
module.exports = {
    mode: 'development',
    entry: {
        bundle : './src/index.js',
        vendor : VERDOR_LIBS
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    output : {
        path : path.join(__dirname,'dist'),
        filename : '[name].[chunkhash].js'
    },
    module : {
        rules : [
            {
                use : {
                    loader: "babel-loader"
                  },
                test : /\.js|jsx$/,
                exclude : '/node_modules/'
            },
            {
                use : [
                    'style-loader',
                    'css-loader'
                ],
                test : /\.css$/,
            },
            {
                loader : 'file-loader',
                test :/\.jpeg$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2|\.eot$|\.ttf$|\.wav$|\.mp3$|\.ico$/
            }
        ]
    },
    plugins : [
        new webpack.ProvidePlugin({
            '$':'jquery',
            'jQuery':'jquery',
            'window.$':'jquery',
            'window.jQuery':'jquery'
        }),
       new HTMLWebpackPlugin({
           template : './public/index.html',
           favicon: './public/favicon.ico',
       }),
       new ManifestPlugin({
        fileName: '[name].[chunkhash].json',
       }),
       new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname,'public'),
            to: path.join(__dirname,'dist'),
            globOptions: {
              ignore: [
                // Ignore all `txt` files
                '**/index.html',
                // Ignore all files in all subdirectories
                '**/subdir/**',
              ],
            },
          },
        ],
      }),
       
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'vendor',
                    chunks: 'initial',
                }
          }
        }
      },
      devServer

}
