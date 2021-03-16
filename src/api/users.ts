import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../Models/User';
import { IMongoDBUser } from 'src/types';

const router = Router();

router.get('/me', (req: Request, res: Response) => {
  // user gets attached to the req.user in the deserialize user function.
  console.log(req.user);
  res.send(req.user);
});

// router.post('/login', passport.authenticate('local'), (req: Request, res: Response, next: any) => {
//   res.json('Successfully Authenticated');
// });

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('success');
});

router.post('/register', (req: Request, res: Response) => {
  const { username, password } = req?.body;

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    res.send('Improper values');
    return;
  }

  User.findOne({ username: username }, async (err: Error, doc: IMongoDBUser) => {
    if (err) throw err;

    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        password: hashedPassword,
        username,
      });
      await newUser.save();
      res.json({ status: 'success', user: newUser });
    }

    if (doc) res.send('User already exists');
  });
});

router.get('/logout', (req: Request, res: Response) => {
  if (req.user) {
    req.logout();
    res.send('done');
  }
});

module.exports = router;
