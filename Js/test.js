
var url = require('url');
var url_parts = url.parse(request.url, true);
var query = url_parts.query;
document.getElementById('test').innerHTML = query;

