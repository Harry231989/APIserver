const express = require('express');
const app = express();
const http = require('http');
fs = require('fs'),
url = require('url');
var  server = http.createServer(function(request, response){

 let topMovies = [
   {
     title: 'The Lord of the Ring',
     author:J Tolkien
   },
   {
     title:'Breaking Bad',
     author:Vince Gilligan
   },
   {
     title:'Terminator 2 Judgment Day',
     author:James Cameron
   },
   {
     title:'Apocalypto',
     author:Mel Gibson
   },
   {
     title:'Training Day',
     author:Richard Lindheim
   },
   {
     title:'Gladiator',
     author:David Franzoni
   },
   {
     title:'300 Spartans',
     author:Ugo Liberatore
   },
   {
     title:'The Shawshank Redemption',
     author:Stephen King
   },
   {
     title:'The Dark Knight',
     author:Emma Thomas
   },
   {
     title:'Avatar',
     author:James Cameron
   }
 ];

 app.get('/movies',(req,res) =>{
   res.json(topmovies);
 });

 app.get('/', (req, res) => {
   res.send('Top 10 Movies!');
 });



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
app.listen(5000, () =>
  console.log('Movies app coming on port 5000');
);
