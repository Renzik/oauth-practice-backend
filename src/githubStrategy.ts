import { Router } from 'express';
import passport from 'passport';
import User from './Models/User';
import { IMongoDBUser } from './types';

const router = Router();
const GithubStrategy = require('passport-github').Strategy;

module.exports = router;

var GitHubStrategy = require('passport-github').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    function (_: any, __: any, profile: any, cb: any) {
      // insert into db.
      User.findOne({ githubId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
        // return the error but no user is coming back
        if (err) return cb(err, null);

        if (!doc) {
          // create new user
          const newUser = new User({
            githubId: profile.id,
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

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
