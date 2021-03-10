import { Router } from 'express';
const router = Router();

router.get('/me', (req, res) => {
  try {
    // user gets attached to the req.user in the deserialize user function.
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send('done');
  }
});

module.exports = router;
