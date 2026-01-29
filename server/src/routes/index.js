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

// In-memory forum posts (for demo only)
// In a production app, this would be stored in a database
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
  {
    id: 4,
    author: "Priya K",
    text: "What are the best resources to learn JavaScript in 2025?",
    meta: "Replies: 4 | Posted: 5 hours ago",
  },
  {
    id: 5,
    author: "Mike T",
    text: "How to deploy a MERN stack application to production?",
    meta: "Replies: 2 | Posted: 1 day ago",
  },
  {
    id: 6,
    author: "Emma W",
    text: "What are the key differences between React and Vue?",
    meta: "Replies: 7 | Posted: 3 days ago",
  },
  {
    id: 7,
    author: "David R",
    text: "How to optimize website performance for better SEO?",
    meta: "Replies: 3 | Posted: 2 days ago",
  },
  {
    id: 8,
    author: "Lisa M",
    text: "Best practices for API security in 2025",
    meta: "Replies: 5 | Posted: 4 days ago",
  },
  {
    id: 9,
    author: "James P",
    text: "How to implement JWT authentication in a Node.js app?",
    meta: "Replies: 6 | Posted: 5 days ago",
  },
  {
    id: 10,
    author: "Sophia L",
    text: "What are the latest trends in web development for 2025?",
    meta: "Replies: 9 | Posted: 1 week ago",
  }
];

let nextForumId = forumPosts.length + 1;

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

