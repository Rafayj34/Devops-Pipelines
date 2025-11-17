import { signUp } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

// Example route for user authentication
router.post('/sign-up', signUp);


router.post('/sign-in', (req, res) => {
  res.send('POST /auth/sign-in endpoint');
});
router.post('/sign-out', (req, res) => {
  res.send('POST /auth/sign-out endpoint');
});

export default router;
