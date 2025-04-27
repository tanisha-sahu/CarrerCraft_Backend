"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
// @ts-ignore: no @types/bcryptjs installed
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// ─── SIGN UP ───────────────────────────────────────────────────────────────────
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, profession } = req.body;
    if (!name || !email || !password || !profession) {
        res.status(400).json({ error: 'All fields are required.' });
        return;
    }
    try {
        // cast to any so TS won’t complain about .email/.name/.profession
        const exists = yield User_1.UserModel.findOne({ email }).exec();
        if (exists) {
            res.status(400).json({ error: 'User already exists.' });
            return;
        }
        // hash password
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        // create user
        const newUser = yield User_1.UserModel.create({
            name,
            email,
            password: hashed,
            profession,
        });
        // grab string ID
        const userId = newUser._id.toString();
        // store in session
        req.session.user = {
            id: userId,
            name: newUser.name,
            email: newUser.email,
            profession: newUser.profession,
        };
        res
            .status(201)
            .json({ message: 'User registered successfully', user: req.session.user });
    }
    catch (err) {
        console.error('SIGNUP ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
}));
// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }
    try {
        const user = yield User_1.UserModel.findOne({ email }).exec();
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password.' });
            return;
        }
        const ok = yield bcryptjs_1.default.compare(password, user.password);
        if (!ok) {
            res.status(400).json({ error: 'Invalid email or password.' });
            return;
        }
        const userId = user._id.toString();
        req.session.user = {
            id: userId,
            name: user.name,
            email: user.email,
            profession: user.profession,
        };
        res.json({ message: 'Login successful', user: req.session.user });
    }
    catch (err) {
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
}));
// ─── CURRENT SESSION ───────────────────────────────────────────────────────────
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    }
    else {
        res.status(401).json({ message: 'No active session' });
    }
});
// ─── LOGOUT ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
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
exports.default = router;
