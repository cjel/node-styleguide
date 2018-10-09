const CopyWebpackPlugin = require('copy-webpack-plugin')

const filedataStore = require('pug-contentswitch-loader/lib/filedata-store')

function StyleguidePlugin(options) {
}

StyleguidePlugin.prototype.apply = function(compiler) {

  compiler.plugin('entryOption', function() {
    new CopyWebpackPlugin([
      {
        from: __dirname + '/index.html',
        to: 'styleguide/',
      },
      {
        from: __dirname + '/styleguide.*.css',
        to: 'styleguide/',
        flatten: true,
      },
      {
        from: __dirname + '/styleguide.*.js',
        to: 'styleguide/',
        flatten: true,
      },
    ]).apply(compiler)
  });

  compiler.hooks.emit.tapAsync('StyleguidePlugin', (compilation, callback) => {
    titledata = filedataStore.getTitles()
    titledata = JSON.stringify(titledata)
    compilation.assets['styleguide/styleguidefiles.json'] = {
      source: function() {
        return titledata
      },
      size: function() {
        return titledata.length
      }
    }
    callback()
  })

}

module.exports = StyleguidePlugin
