import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../Models/User';
import { IMongoDBUser } from 'src/types';

const router = Router();

router.get('/me', (req: Request, res: Response) => {
  try {
    // user gets attached to the req.user in the deserialize user function.
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
  }
});

router.post('/login', (req: Request, res: Response, next: any) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      console.log('WE EVEN TRYING?');
      if (err) throw err;
      if (!user) res.json({ status: 'failed', user: user });
      else {
        req.logIn(user, err => {
          if (err) throw err;
          return res.send({ status: 'success', user: user });
        });
      }
    })(req, res, next);
  } catch (error) {
    console.error(error);
  }
});

router.post('/register', (req: Request, res: Response) => {
  const { username, email } = req.body;
  User.findOne({ email: email }, async (err: Error, doc: IMongoDBUser) => {
    if (err) throw err;

    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      });
      await newUser.save();
      res.json({ status: 'success', user: newUser });
    }

    if (doc) {
      res.send('User already exists');
    }
  });
});

router.get('/logout', (req: Request, res: Response) => {
  if (req.user) {
    req.logout();
    res.send('done');
  }
});

module.exports = router;
