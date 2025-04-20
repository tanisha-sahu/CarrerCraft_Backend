// src/routes/auth.ts
import express, { Request, Response } from 'express';
// @ts-ignore: no @types/bcryptjs installed
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';

const router = express.Router();

// Inline session augmentation so TS knows req.session.user exists:
declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}

// ─── SIGN UP ───────────────────────────────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, profession } = req.body;
  if (!name || !email || !password || !profession) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  try {
    // cast to any so TS won’t complain about .email/.name/.profession
    const exists: any = await UserModel.findOne({ email }).exec();
    if (exists) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    // create user
    const newUser: any = await UserModel.create({
      name,
      email,
      password: hashed,
      profession,
    });

    // grab string ID
    const userId = (newUser._id as any).toString();

    // store in session
    req.session.user = {
      id:         userId,
      name:       newUser.name,
      email:      newUser.email,
      profession: newUser.profession,
    };

    res
      .status(201)
      .json({ message: 'User registered successfully', user: req.session.user });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const user: any = await UserModel.findOne({ email }).exec();
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }

    const userId = (user._id as any).toString();
    req.session.user = {
      id:         userId,
      name:       user.name,
      email:      user.email,
      profession: user.profession,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── CURRENT SESSION ───────────────────────────────────────────────────────────
router.get('/session', (req: Request, res: Response) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'No active session' });
  }
});

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error('LOGOUT ERROR:', err);
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
