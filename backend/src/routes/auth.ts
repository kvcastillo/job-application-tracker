import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router = Router();

/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Register failed" });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
