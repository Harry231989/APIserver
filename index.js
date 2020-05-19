const express = require('express'),
morgan = require('morgan');
const bodyParser = require('body-parser'),
  methodOverride = require('method-override');
const app = express();


 let topMovies  = [
   {
     title: 'The Lord of the Ring',
     author:'J Tolkien'
   },
   {
     title:'Breaking Bad',
     author:'Vince Gilligan'
   },
   {
     title:'Terminator 2 Judgment Day',
     author:'James Cameron'
   },
   {
     title:'Apocalypto',
     author:'Mel Gibson'
   },
   {
     title:'Training Day',
     author:'Richard Lindheim'
   },
   {
     title:'Gladiator',
     author:'David Franzoni'
   },
   {
     title:'300 Spartans',
     author:'Ugo Liberatore'
   },
   {
     title:'The Shawshank Redemption',
     author:'Stephen King'
   },
   {
     title:'The Dark Knight',
     author:'Emma Thomas'
   },
   {
     title:'Avatar',
     author:'James Cameron'
   }
 ];


app.use(express.static('public'));
 app.use(morgan('common'));
 app.get('/', (req, res) => {
   res.send('Top 10 Movies!');
 });

 app.get('/movies',(req,res) =>{
   res.json(topMovies);
 });



 app.use(bodyParser.urlencoded({
   extended: true
 }));

 app.use(bodyParser.json());
 app.use(methodOverride());

 app.use((err, req, res, next) => {
   // logic
 });


app.listen(5000, () =>
{
  console.log('Movies app coming on port 5000');
});
