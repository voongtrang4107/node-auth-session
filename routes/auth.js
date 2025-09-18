import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// Register
router.post("/register", async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const user = new User({ email, passwordHash: "" });
    await user.setPassword(password);
    await user.save();

    req.session.userId = user._id;
    res.status(201).json({ message: "Registered", user: { id: user._id, email: user.email } });
});

// Login
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password)))
        return res.status(401).json({ error: "Invalid credentials" });

    req.session.userId = user._id;
    res.json({ message: "Logged in", user: { id: user._id, email: user.email } });
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ message: "Logged out" });
    });
});

// Who am I
router.get("/me", (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });
    res.json({ userId: req.session.userId });
});

export default router;