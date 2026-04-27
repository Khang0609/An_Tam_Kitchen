import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { userRepository } from "../container";
import { UserSchema } from "@repo/types";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "fallback-refresh-secret-for-dev";


const SignupSchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
});

const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedBody = SignupSchema.parse(req.body);

    const existingUser = await userRepository.findByEmail(parsedBody.email);

    if (existingUser) {
      // Generic error để tránh user enumeration
      return res
        .status(400)
        .json({ error: "Signup failed. User may already exist." });
    }

    const hashedPassword = await argon2.hash(parsedBody.password);

    const newUser = await userRepository.create({
      email: parsedBody.email,
      password: hashedPassword,
      name: parsedBody.name,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.issues });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsedBody = LoginSchema.parse(req.body);

    const user = await userRepository.findByEmail(parsedBody.email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await argon2.verify(user.password, parsedBody.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Lưu refresh token vào DB
    await userRepository.update(user.id, { refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.issues });
    }
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
          userId: string;
        };
        await userRepository.update(decoded.userId, { refreshToken: null });
      } catch (_err) {
        // Token không hợp lệ/hết hạn → vẫn xoá cookie, bỏ qua lỗi DB
      }
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
