import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Simple in-memory user store so you don't need a database for the demo
const users = new Map(); // key: email, value: { id, name, email, passwordHash }
let seq = 1;

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, password required" });
  }
  const key = email.toLowerCase();
  if (users.has(key)) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: `u${seq++}`, name, email, passwordHash };
  users.set(key, user);
  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const key = (email || "").toLowerCase();
  const user = users.get(key);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Update profile (name/email/password) - protected route
router.put("/profile", requireAuth, async (req, res) => {
  const { name, email, password } = req.body || {};
  const currentEmail = (req.user.email || "").toLowerCase();
  const user = users.get(currentEmail);
  if (!user) return res.status(404).json({ error: "User not found" });

  let newEmailKey = currentEmail;
  if (email && email.toLowerCase() !== currentEmail) {
    const candidate = email.toLowerCase();
    if (users.has(candidate)) {
      return res.status(409).json({ error: "Email already in use" });
    }
    users.delete(currentEmail);
    newEmailKey = candidate;
    user.email = email;
  }

  if (name) user.name = name;
  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  users.set(newEmailKey, user);
  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});


