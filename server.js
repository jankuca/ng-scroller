var http = require('http');
var static = require('node-static');

var file = new static.Server(__dirname);
var server = http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
});

server.listen(process.env['PORT']);
