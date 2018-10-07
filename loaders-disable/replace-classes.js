const { getOptions, parseQuery, stringifyRequest } = require('loader-utils')
const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const Module = require("module");

module.exports = function(source) {
  const options = getOptions(this);
  var that = this
  var params = []


  if (this.resourceQuery) {
    params = parseQuery(this.resourceQuery)
  }

  if ('replace' in options && options['replace'] == false) {
    return source
  }

  cb = this.async()

  if (!('file' in options)) {
    throw new Error('No file provided')
  }

  function processModuleData(err, moduleSource, sourceMap, module){
    var result = exec.call(that, module._source._value, options['file'])
    var locals = result.locals
    const cheerio = require('cheerio')
    var html = cheerio.load(source)
    for (var local in locals) {
      html('.' + local).addClass(locals[local]).removeClass(local)
      html('#' + local).attr('id', locals[local])
    }
    cb(null, html.html())
  }

  this.loadModule(options['file'], processModuleData);

  function exec(code, filename) {
    const module = new Module(filename, this);
    module.paths = Module._nodeModulePaths(this.rootContext);
    module.filename = filename;
    module._compile(code, filename);
    return module.exports;
  }

}
