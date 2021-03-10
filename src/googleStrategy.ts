import passport from 'passport';
import { Router } from 'express';
import User from './Models/User';
import { IMongoDBUser } from './types';

const router = Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = router;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    // this function gets called on a succesful authentication!
    // the function below is called the verify cb.
    function (_: any, __: any, profile: any, cb: any) {
      // insert into db.
      User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
        // return the error but no user is coming back
        if (err) return cb(err, null);

        if (!doc) {
          // create new user
          const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName,
          });
          await newUser.save();
          // if it doesn't exist send the new user
          cb(null, newUser);
        }
        // if it does exist send the found doc
        cb(null, doc);
      });
    }
  )
);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
