import express from "express";

import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing Email or Password" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "There is no user registered with that email." });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.status(403).json({ message: "Invalid credentials." });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("COOKIE-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName, confirmPassword } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "One or more input are missing" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords doesn't match." });

    const salt = random();
    const user = await createUser({
      email,
      firstName,
      lastName,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const googleRegister = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, familyName, givenName, googleId, name, imageUrl } = req.body;

    if (!email || !familyName || !givenName || !googleId || !name) {
      return res
        .status(400)
        .json({ message: "One or more inputs are missing." });
    }

    const existingUser = await getUserByEmail(email);
    const salt = random();

    if (existingUser) {
      existingUser.authentication.sessionToken = authentication(
        salt,
        existingUser._id.toString()
      );

      res.cookie("COOKIE-AUTH", existingUser.authentication.sessionToken, {
        domain: "localhost",
        path: "/",
      });

      await existingUser.save();

      res.status(200).json({ message: "Google user authenticated." });
    } else {
      const user = await createUser({
        googleId,
        email,
        firstName: givenName,
        lastName: familyName,
        displayName: name,
        avatar: imageUrl,
        googleLogin: true,
        authentication: {
          salt,
        },
      });

      return res.status(200).json(user).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
