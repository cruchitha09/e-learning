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


