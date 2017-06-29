var url = require('url');
var u =
  "https://item.taobao.com/item.htm?spm=a2106.m5382.1000384.170.nVeCYr&id=533772764450&scm=1029.newlist-0.1.16&ppath=&sku=&ug=#detail";

var qs = url.parse(u).query;

var qsa = qs.split('&');
var query = {};
qsa.forEach(function(item) {
  var a = item.split('=');
  query[a[0]] = a[1];
})

console.log(query);
