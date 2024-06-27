import express from "express";

import { deleteUserById, getUsers, getUserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json({ message: `User successfully deleted` });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      avatar,
      address,
      phoneNumber,
      lastLogin,
      cart,
      orders,
      wishlist,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const user = await getUserById(id);

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.avatar = avatar;
    user.address = address;
    user.phoneNumber = phoneNumber;
    user.updatedAt = new Date();
    user.lastLogin = lastLogin;
    user.cart = cart;
    user.orders = orders;
    user.wishlist = wishlist;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
