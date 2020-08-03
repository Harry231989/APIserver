const passport = require('passport');
require('./passport');



const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const express = require('express'),
morgan = require('morgan');
const bodyParser = require('body-parser')

  methodOverride = require('method-override');
const uuid = require('uuid');
const app = express();

app.use(bodyParser.json());
let auth = require('./auth')(app);

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());

/*rest of code for added cors here*/
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){  // If a specific origin isn't found on the list of allowed origins
       let message = 'The CORS policy for this application doesnt allow access from origin '  + origin;
       return callback(new Error(message ), false);
     }
     return callback(null, true);
  }
}));

/*
const movies =
 [
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
*/
// moivies CRUD
app.use(express.static('public'));
 app.use(morgan('common'));
 app.get('/', (req, res) => {
   res.send('Top 10 Movies!');
 });

  //Get the list of data about All Movies



 app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


 // Gets the data about a single movie, by name

 app.get('/movies/:title', (req, res) => {
   res.json(Movies.find((movie) =>
   {return movie.Title === req.params.title}));
 });

//Get the data about a single movie, by genre

app.get('/moviesgenre/:genre', (req, res) => {
  res.json(Movies.find((movie) =>
  {return movie.Genre === req.params.genre  }));
});

//Get the data about a single movie,by director
app.get('/moviesdirector/:director', (req, res) => {
  res.json(Movies.find((movie) =>
{return movie.Director === req.params.director}));
});



//Get the data about a single movie, by
 // User CRUD
 //Allow new users to register

 app.post('/users',
   // Validation logic here for request
   //you can either use a chain of methods like .not().isEmpty()
   //which means "opposite of isEmpty" in plain english "is not empty"
   //or use .isLength({min: 5}) which means
   //minimum value of 5 character are only allowed
   [
     check('Username', 'Username is required').isLength({min: 5}),
     check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
     check('Password', 'Password is required').not().isEmpty(),
     check('Email', 'Email does not appear to be valid').isEmail()
   ],(req, res) => {

     // check the Validation object for errors
     let errors = validationResult(req);

     if (!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
     }

   let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
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
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Get all users
app.get('/users' , (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
});

//Get a user by Username
app.get('/users/:Username', (req,res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

 //Add a user
 /* We'll expect JSON in this Format
 {
   ID: Integer,
   Username: String,
   Password: String,
   Email: String,
   Birthday: Date
 }*/
 /*
  app.post('/users', (req, res) => {
    let newUser = req.body;

   if (!newUser.name) {
     const message = 'feel free to register';
     res.status(400).send(message);
   } else {
     newUser.id = uuid.v4();
     movies.push(newUser);
     res.status(201).send(newUser);
   }
});
*/
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

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port 5000');
});








//
