import passport from 'passport';
import { Router } from 'express';
import User from './Models/User';
import { IMongoDBUser } from './types';

const router = Router();
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = router;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/callback',
    },
    function (_: any, __: any, profile: any, cb: any) {
      console.log('PROFILE:', profile);
      // insert into db.
      User.findOne({ twitterId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
        // return the error but no user is coming back
        if (err) return cb(err, null);

        if (!doc) {
          // create new user
          const newUser = new User({
            twitterId: profile.id,
            username: profile.username,
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

router.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email', 'profile'] }));

router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login',
    successRedirect: 'https://modest-einstein-76cd0d.netlify.app/',
  })
);
