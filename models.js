const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myFlixDB' , {useNewUrlParser: true, useUnifiedTopology: true });

const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  favoriteMovies:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let movieSchema = mongoose.Schema({
   Title: {type: String, required: true},
   Description: {type: String, required: true},
   Genre: {
     Name: String,
     Description: String
   },
   Director: {
     Name: String,
     Bio: String
   },
   Actors: [String],
   ImagePath: String,
   Featured: Boolean
});

let userSchema = mongoose.Schema({
   Username: {type: String, required: true},
   Password: {type: String, required: true},
   Email: {type: String, required: true},
   Birthday: Date,
   favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
});

let Movie = mongoose.model('movies', movieSchema);
let User = mongoose.model('users', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
