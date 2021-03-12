import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../Models/User';

const router = Router();

router.get('/me', (req: Request, res: Response) => {
  try {
    // user gets attached to the req.user in the deserialize user function.
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
  }
});

router.post('/login', (req: Request, res: Response) => {
  console.log(req.body);
});

router.post('/register', async (req: Request, res: Response) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  await newUser.save();

  res.json({ status: 'success', user: newUser });
});

router.get('/logout', (req: Request, res: Response) => {
  if (req.user) {
    req.logout();
    res.send('done');
  }
});

module.exports = router;
