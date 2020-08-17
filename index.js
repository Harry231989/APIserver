const passport = require('passport');
require('./passport');


const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const express = require('express');
const port = process.env.PORT || 5000;
morgan = require('morgan');
const bodyParser = require('body-parser')

methodOverride = require('method-override');
const uuid = require('uuid');
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
let auth = require('./auth')(app);

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());


/*rest of code for added cors here*/
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {  // If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));


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
  Movies.find({ 'Title': req.params.title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Get the data about a single movie, by genre

app.get('/movies/genre/:genre', (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genre })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Get the data about a single movie,by director
app.get('/movies/director/:director', (req, res) => {
  Movies.find({ 'Director.Name': req.params.director })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});





app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 character are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

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
            .then((user) => { res.status(201).json(user) })
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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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


//update infos by users on their own/
app.put('/updateuser/:username/:password/:email/:dateofbirth', passport.authenticate('jwt', { session: false }), (req, res) => {
  let user = user.find((movies) => { return user.update === req.params.update });

  if (user) {
    user.movies[req.params.update] = parseInt(req.params.username.password.email.dateofbirth);
    res.status(201).send('user' + req.params.username + 'has a password' + req.params.dateofbirth + 'and' + req.parmas.email);
  } else {
    res.status(404).send('user ' + req.params.name + 'can not update here.');
  }
});

//allow  users favorite Movies
app.post('/adduserfavoritemovie/:favorite/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  let users = users.find((movies) => { return user.favorite === req.params.favorite });

  if (user) {
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
  } else {
    res.status(404).send('user favorite movie' + req.params.favorite + 'was not found.');
  }
});

app.use((err, req, res, next) => {
  // logic
});

app.listen(port, () => {
  console.log(`Example app is listening on port http://localhost:${port}`);
});








//
