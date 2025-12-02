import { Router } from "express";
import { router as authRouter, requireAuth } from "./auth.js";

export const router = Router();

router.use("/auth", authRouter);

router.get("/courses", (_req, res) => {
  res.json([
    { id: "c1", title: "Intro to Web Development", level: "Beginner" },
    { id: "c2", title: "React Fundamentals", level: "Intermediate" },
  ]);
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Simple in-memory forum posts (for demo only)
const forumPosts = [
  {
    id: 1,
    author: "John Doe",
    text: "How do I connect my frontend to a database?",
    meta: "Replies: 3 | Posted: 2 days ago",
  },
  {
    id: 2,
    author: "Sarah Lee",
    text: "Which project should I start with as a beginner?",
    meta: "Replies: 5 | Posted: 1 day ago",
  },
  {
    id: 3,
    author: "Alex Smith",
    text: "Can someone explain the difference between CSS Grid and Flexbox?",
    meta: "Replies: 2 | Posted: 3 hours ago",
  },
];
let nextForumId = 4;

router.get("/forum", (_req, res) => {
  res.json(forumPosts);
});

router.post("/forum", (req, res) => {
  const { text, author } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  const post = {
    id: nextForumId++,
    author: author || "Anonymous",
    text: text.trim(),
    meta: "Replies: 0 | Just now",
  };
  forumPosts.unshift(post);
  res.status(201).json(post);
});

router.delete("/forum/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = forumPosts.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  forumPosts.splice(idx, 1);
  res.status(204).send();
});

