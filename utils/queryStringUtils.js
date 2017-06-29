var url = require('url');

var parse = function parse(url_str) {
  var query = {};
  try {
    var qs = url.parse(url_str).query;
    var qsa = qs.split('&');
    qsa.forEach(function(item) {
      var a = item.split('=');
      query[a[0]] = a[1];
    });
  } catch (e) {
    throw e;
  } finally {

  }
  return query;
};



module.exports = {
  parse
};
