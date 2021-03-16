import User from './Models/User';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

module.exports = () =>
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email: any, password: any, done: any) => {
      User.findOne({ email: email }, (err: any, user: any) => {
        if (err) throw err;

        if (!user) return done(null, false);

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;

          if (result) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );
