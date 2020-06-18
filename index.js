const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:5000/myFlixDB' , {useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express'),
morgan = require('morgan');
const bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
    uuid = require('uuid');
const app = express();







let movies = [
{
  id:1,
  name: 'The Lord of the Rings',
  genre: 'Action',
  image:'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT9J7XACn3tlD6v4UXRMvT2wJN8FGCCPeh8U3RkZ6__tR4wGhSo',
  actors:'Orlando Bloom, Elijah Wood, Viggo Mortensen, Ian Mckellen',
  director: {
    author:'J Tolkien',
    dateofbirth:6/03/1957

  }
},
{
  id: 2,
  name: 'Breaking Bad',
  genre: 'Drama',
  image: 'https://www.google.com/search?tbm=isch&q=Breaking+Bad#imgrc=qIJkHEowSA_PoM&imgdii=wlMFAFNtj8ca-M',
  actors:'Bryan Cranston ,Aaron Paul ,Skyler',
  director: {
    author: 'Vince Gilligan',
    dateofbirth:04/05/1963
  }
},
{
  id: 3,
  name: 'Terminator 2 Judgment Day',
  genre: 'Action',
  image: 'https://www.google.de/search?q=terminator+2+images&safe=strict&sxsrf=ALeKk005KcfNsceBeymjcAapcsBxLwnREw:1590189062320&tbm=isch&source',
  actors: 'Arnold Schwarzenegger,Robert Patr,Edward Furlong,Linda Hamilton',
  director: {
    author: 'James Cameron',
    dateofbirth:03/02/1974
  }
},
{
  id: 4,
  name:'Apocalypto',
  genre: 'Adventure',
  image: 'https://www.google.com/search?tbm=isch&q=Apocalypto#imgrc=0XTUWsG91z0SrM',
  actors: 'Rudy Youngblood,Dalla Hernandez,Gerardo Taracena,Morris Birdyellowh',
  director: {
    author:'Mel Gibson',
    dateofbirth:09/05/1963
  }
},
{
  id: 5,
  name:'Training Day',
  genre: 'Drama',
  image: 'https://www.google.com/search?tbm=isch&q=Training+Day',
  actors:'Denzel Washington,Eva Mendes,Ethan Hawke,Cliff Curtis',
  director: {
    author:'Richard Lindheim',
    dateofbirth:11/12/1971
  }
}
];

let users = [
  {
    name: 'Jonh',
    password: 'jesus111bosom',
    email:'johnteyyy@yahoo.com',
    dateofbirth:07/06/1992,
    favorite: 'Training Day'
  },
  {
    name: 'Ama Bayor',
    password: 'lovemyboyf23',
    email: 'Bayordeserious@yahoo.com',
    dateofbirth:04/10/1989,
    favorite: 'The Lord of the Rings'
  },
  {
    name:'Petre',
    password: 'fusballistmein1',
    email:'Russiaismyhome@yahoo.com',
    dateofbirth:11/12/1998,
    favorite:'Breaking bad'
  },
  {
    name: 'Rich',
    password: 'Akobaby1',
    email: 'Richi149jnr@yahoo.com',
    dateofbirth:24/11/1984,
    favorite: 'Training Day'
  },
  {

  }


];
// moivies CRUD
app.use(express.static('public'));
 app.use(morgan('common'));
 app.get('/', (req, res) => {
   res.send('Top 10 Movies!');
 });

  //Get the list of data about All Movies
 app.get('/movies',(req,res) =>{
   res.json(movies);
 });


 // Gets the data about a single movie, by name

 app.get('/movies/:name', (req, res) => {
   res.json(movies.find((movie) =>
   {return movie.name === req.params.name}));
 });

//Get the data about a single movie, by genre

app.get('/moviesgenre/:genre', (req, res) => {
  res.json(movies.find((movie) =>
  {return movie.genre === req.params.genre  }));
});

//Get the data about a single movie,by director
app.get('/moviesdirector/:director', (req, res) => {
  res.json(movies.find((movie) =>
{return movie.director === req.params.director}));
});



//Get the data about a single movie, by
 // User CRUD
 //Allow new users to register
 
 app.post('/adduser', (req, res) => {
   Users.findOne({ Username: req.body.Username })
   .then((user)  => {
     if (user) {
       return res.status(400).send(req.body.Username + 'already exists');
     } else {
       Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
     }
   })
   .catch((error)  =>  {
     console.error(error);
     res.status(500).send('Error: ' + error);
   });



 //update infos by users on their own/
 app.put('/updateuser/:username/:password/:email/:dateofbirth' , (req, res) => {
   let user = user.find((movies) => { return user.update === req.params.update });

   if (user) {
     user.movies[req.params.update] = parseInt(req.params.username.password.email.dateofbirth);
     res.status(201).send('user' + req.params.username + 'has a password' + req.params.dateofbirth + 'and' + req.parmas.email);
  } else {
    res.status(404).send('user ' + req.params.name + 'can not update here.');
   }
 });

//allow  users favorite Movies
app.post('/adduserfavoritemovie/:favorite/movies' , ( req, res) => {
  let users = users.find((movies) => {return user.favorite === req.params.favorite});

  if(user) {
    let favoriteMovies = Object.values(user.favorite);// Object.value() filters out object's keys and keeps the values that are returned as a new array
    let allofMovies = 0;
    favoriteMovies.forEach(movie => {
      allofMovies = allofMovies + movie;
    });

    let movies = allofMovies / favoriteMovies.lenght;
    console.log(allofMovies);
    console.log(favoriteMovies.lenght);
    console.log(movies);
    res.status(201).send('' + movie);
    // res.status(201).send(movies);
  }else {
    res.status(404).send('user favorite movie' + req.params.favorite + 'was not found.');
  }
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
