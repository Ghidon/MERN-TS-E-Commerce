import express from "express";
import { merge, get } from "lodash";

import { getUserBySessionToken, getUserById } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["COOKIE-AUTH"];

    if (!sessionToken) {
      return res.status(403).json({ message: "Missing Session Token" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res
        .status(403)
        .json({ message: "Missing User with that Session Token" });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.status(400).json({ message: "User cannot be identified" });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({ message: "User ID mismatch" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.status(400).json({ message: "User cannot be identified" });
    }
    const currentUser = await getUserById(currentUserId);

    if (!currentUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isAdmin = (currentUser as { isAdmin?: boolean }).isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "User is not an admin" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
