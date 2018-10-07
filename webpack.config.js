const {getIfUtils, removeEmpty}     = require('webpack-config-utils');
const BrowserSyncPlugin             = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin            = require('clean-webpack-plugin');
const CopyWebpackPlugin             = require('copy-webpack-plugin');
const globImporter                  = require('node-sass-glob-importer');
const HtmlBeautifyPlugin            = require('html-beautify-webpack-plugin');
const HtmlWebpackExternalsPlugin    = require('html-webpack-externals-plugin')
const HtmlWebpackPlugin             = require('html-webpack-plugin');
const MiniCssExtractPlugin          = require("mini-css-extract-plugin");
const path                          = require('path');
const PugPluginCSSModules           = require('pug-plugin-css-modules').default;
const SymlinkWebpackPlugin          = require('symlink-webpack-plugin');
const UglifyJsPlugin                = require('uglifyjs-webpack-plugin');
const WebpackNotifierPlugin         = require('webpack-notifier');
const webpack                       = require('webpack');

const find = require('find');


module.exports = env => {

  var srcFiles = {}
  var markupRoot = '/src/markup/samples'
  var fileMapping = {
    'Samples 1': 'samples1',
    'Samples 2': 'samples2',
  }
  var htmlPlugins = []

  //for (key in fileMapping) {
  //  srcFiles[key] = find.fileSync(/\.pug$/, __dirname + markupRoot + '/' + fileMapping[key])
  //  srcFiles[key].forEach(function(element){
  //    var templateFile = element.replace(path.resolve(__dirname), '')
  //    var filename = templateFile.substring(templateFile.lastIndexOf("/") + 1, templateFile.lastIndexOf("."));
  //    htmlPlugins.push(
  //      new HtmlWebpackPlugin({
  //        chunksSortMode: 'dependency',
  //        filename: path.resolve(__dirname, 'dist/samples/' + fileMapping[key] + '/' + filename + '.html'),
  //        filetype: 'pug',
  //        inject: false,
  //        template: '.' + templateFile,
  //      })
  //    )
  //  })
  //}
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      //filename: path.resolve(__dirname, 'Resources/Public/styleguide/templates/index.html'),
      filename: path.resolve(__dirname, 'dist/index.html'),
      filetype: 'pug',
      template: path.resolve(__dirname, 'src/markup/index.pug'),
    }),
  )

  const { ifProd, ifNotProd } = getIfUtils(env);
  const localIdentName = 'stlgd__[hash:base64:16]'
  return {
    mode: ifProd('production', 'development'),
    module: {
      rules: [
        {
          include: [path.resolve(__dirname, 'src/components')],
          loader: 'babel-loader',
          options: {
            plugins: ['syntax-dynamic-import'],
            presets: [
              [
                'env',
                {
                  modules: false
                }
              ]
            ]
          },
          test: /\.js$/
        },
        {
          test: /\.pug$/,
          oneOf: [
            {
              exclude: /\.vue$/,
              use: [
                {
                  loader: 'html-loader',
                  options: {
                    interpolate: true,
                    removeAttributeQuotes: false,
                    keepClosingSlash: true,
                  },
                },
                {
                  loader: 'replace-classes-loader',
                  options: {
                    replace: ifProd(true, false),
                    file: path.resolve(__dirname, 'src/styles/styleguide.sass') + '?replaceclasses',
                  },
                },
                {
                  loader: 'pug-plain-loader',
                  options: {
                    basedir: 'src/components',
                    //debug: true,
                    plugins: [PugPluginCSSModules({
                      generateScopedName: '[hash:base64:10]',
                      getJSON: (json) => {
                        "use strict";
                        console.log(`>> json: ${JSON.stringify(json, null, 4)}`);
                      }
                    })]
                  },
                },
              ]
            },
            // this applies to <template lang="pug"> in Vue components
            //{
            //  use: [
            //    {
            //      loader: 'pug-plain-loader',
            //      options: {
            //        pretty: true,
            //        plugins: [PugPluginCSSModules({
            //           generateScopedName: '[path][local]-[hash:base64:10]',
            //        })]
            //      }
            //    }
            //  ]
            //}
          ]
        },
        //
        //{
        //  test: /\.pug$/,
        //  loader: 'pug-loader',
        //},
        {
          test: /\.(sass|scss|css)$/,
          oneOf: [
            {
              resourceQuery: /replaceclasses/, // foo.css?inline
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    modules: ifProd(true, false),
                    //sourceMap: true,
                    //importLoaders: 1,
                    localIdentName: localIdentName,
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    importer: globImporter()
                  }
                }
              ]
            },
            {
              use: [
                ifNotProd('style-loader', MiniCssExtractPlugin.loader),
                {
                  loader: 'css-loader',
                  options: {
                    modules: ifProd(true, false),
                    //sourceMap: true,
                    //importLoaders: 1,
                    localIdentName: localIdentName,
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    importer: globImporter()
                  }
                }
              ]
            },
          ]
        },
        {
          //test: /\.(png|jpg|gif|svg)$/,
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              //name: '[name].[ext]',
              //outputPath: 'fonts/',
            }
          }]
        }
      ]
    },
    plugins: htmlPlugins.concat(removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),
      ifProd(
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
          chunkFilename: "[id].css"
        })
      ),
      new HtmlBeautifyPlugin({
        config: {
          html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: true,
            indent_inner_html: true,
            preserve_newlines: true,
            //unformatted: ['i', 'b']
            unformatted: [],
          }
        },
      }),
      ifNotProd(
        new BrowserSyncPlugin(
          {
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:3100/',
            open: false
          },
          {
            reload: false
          }
        )
      ),
      ifNotProd(
        new WebpackNotifierPlugin()
      ),
      ifProd(
        new CleanWebpackPlugin(['dist/'])
      ),
      //new CopyWebpackPlugin([
      //  'frontend/api.php',
      //]),
    ])),
    entry: './src/scripts/app.js',
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        styles: path.resolve(__dirname, 'src/styles'),
      },
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    //resolveLoader: {
    //  modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    //},
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/
          },
        },
        chunks: 'async',
        minChunks: 1,
        minSize: 30000,
        name: true
      },
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: false,
          }
        })
      ],
    },
    devtool: ifProd('', false),
    devServer: {
      port: 3100,
      host: '0.0.0.0',
      disableHostCheck: true,
      watchContentBase: true,
      contentBase: path.resolve(__dirname),
      watchOptions: {
        //poll: true
      }
    }
  }
};
