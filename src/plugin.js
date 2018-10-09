const CopyWebpackPlugin = require('copy-webpack-plugin')

function StyleguidePlugin(options) {
}

StyleguidePlugin.prototype.apply = function(compiler) {

  compiler.plugin('entryOption', function() {
      new CopyWebpackPlugin([
        {
          from: __dirname + '/index.html',
          to: 'styleguide/'
        }

      ]).apply(compiler)
  });

}

module.exports = StyleguidePlugin
