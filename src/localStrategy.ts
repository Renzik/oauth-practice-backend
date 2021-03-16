import { IMongoDBUser } from './types';
import User from './Models/User';
import bcrypt from 'bcryptjs';

const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport: any) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email: any, password: any, done: any) => {
      User.findOne({ email: email }, (err: any, user: any) => {
        if (err) return done(err, false, 'error message');

        if (!user) return done(null, false, 'incorrect username');

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return done(err, false, 'error message');
          if (result) {
            return done(null, user, 'successful login');
          } else {
            return done(null, false, 'incorrect password');
          }
        });
      });
    })
  );
};
