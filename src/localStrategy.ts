import { IMongoDBUser } from './types';
import User from './Models/User';
import bcrypt from 'bcryptjs';

const localStrategy = require('passport-local').Strategy;

module.exports = function (passport: any) {
  passport.use(
    new localStrategy((username: any, password: any, done: any) => {
      User.findOne({ username: username }, (err: any, user: any) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user: any, cb: any) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id: any, cb: any) => {
    User.findOne({ _id: id }, (err: any, user: any) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};
