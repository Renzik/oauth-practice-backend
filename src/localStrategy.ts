import passport from 'passport';
import { Router } from 'express';

import { IMongoDBUser } from './types';
import User from './Models/User';

const router = Router();
const LocalStrategy = require('passport-local').Strategy;

module.exports = router;

passport.use(
  new LocalStrategy((username: string, password: string, done: any) => {
    User.findOne({ username: username }, (err: Error, doc: IMongoDBUser) => {
      if (err) return done(err);
      if (!doc) return done(null, false);
      // if()
    });
  })
);
