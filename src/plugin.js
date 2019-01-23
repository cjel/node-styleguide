const CopyWebpackPlugin             = require('copy-webpack-plugin');
const filedataStore                 = require('pug-contentswitch-loader/lib/filedata-store');
const path                          = require('path');

function StyleguidePlugin(options) {
  this.options = options;
  if (!('root' in options)) {
    this.options['root'] = 'styleguide';
  }
}

StyleguidePlugin.prototype.apply = function(compiler) {

  compiler.hooks.afterPlugins.tap('StyleguidePlugin', (compilation) => {
    new CopyWebpackPlugin([
      {
        from: __dirname + '/index.html',
        to: this.options['root'] + '/',
      },
      {
        from: __dirname + '/styleguide.*.css',
        to: this.options['root'] + '/',
        flatten: true,
      },
      {
        from: __dirname + '/styleguide.*.js',
        to: this.options['root'] + '/',
        flatten: true,
      },
    ]).apply(compiler);
    //callback();
  });

  compiler.hooks.emit.tapAsync('StyleguidePlugin', (compilation, callback) => {
    var pathRelative = path.relative(compiler.options.output.path, this.options['root']);
    titledata = filedataStore.getTitles();
    titledata = JSON.stringify(titledata);
    compilation.assets[pathRelative + '/styleguidefiles.json'] = {
      source: function() {
        return titledata
      },
      size: function() {
        return titledata.length
      }
    };
    callback();
  })

}

module.exports = StyleguidePlugin;
