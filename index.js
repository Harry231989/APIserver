const http = require('http');
fs = require('fs'),
url = require('url');
var  server = http.createServer(function(request, response){

  let addr = request.url,
     q = url.parse(addr, true),
     filePath = '';

   if (q.pathname.includes('documentation')) {
     filePath = (__dirname + '/documentation.html');
   } else {
     filePath = 'index.html';
   }

   fs.readFile(filePath, (err, data) => {
     if (err) {
       throw err;
     }


     fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Added to log.');
  }
});

     response.writeHead(200, { 'Content-Type': 'text/html' });
     response.write(data);
     response.end();

  });


});
server.listen(5000);
console.log("Server running on port 5000")
// project was suppose to run on port 8080 but was in use by unkown windows services or application
