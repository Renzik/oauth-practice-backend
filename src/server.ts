import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import User from './Models/User';
import { IMongoDBUser } from './types';
import bcrypt from 'bcryptjs';

const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = 4000;

mongoose.connect(
  `${process.env.MONGODB_START}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_END}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log('Connected to db successfully');
  }
);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors middleware
const corsHandler = require('./cors');
app.use(cors(corsHandler));

app.set('trust proxy', 1);

// creates session
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      // sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./googleStrategy'));
app.use(require('./twitterStrategy'));
app.use(require('./githubStrategy'));
require('./localStrategy')(passport);

passport.serializeUser((user: IMongoDBUser, done: any) => {
  // the return value is added to the session
  return done(null, user._id);
});

passport.deserializeUser((userId: string, done: any) => {
  // the return value is added to req.user
  User.findById(userId, (err: Error, doc: IMongoDBUser) => {
    return done(null, doc);
  });
});

app.use('/api/users', require('./api/users'));
app.use(
  '/',
  (req, res) => res.redirect('https://modest-einstein-76cd0d.netlify.app/')
  // res.send('why are we hitting this backend route instead of front end??')
);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started in port: ${PORT}`);
});
