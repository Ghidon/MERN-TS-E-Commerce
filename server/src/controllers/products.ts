import express from "express";
import { getUserBySessionToken } from "../db/users";

import {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByTag,
  deleteProductById,
  // updateProductById,
} from "../db/products";

export const createOneProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, description, price } = req.body;
    const sessionToken = req.cookies["COOKIE-AUTH"];
    const existingUser = await getUserBySessionToken(sessionToken);

    if (!name || !description || !price) {
      return res.status(400).json({ message: "One or more input are missing" });
    }

    const product = await createProduct({
      name,
      description,
      price,
    });

    product.createdBy = existingUser._id;

    return res.status(200).json(product).end();
  } catch (error) {}
};

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const products = await getProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    return res.status(200).json(product).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedProduct = await deleteProductById(id);

    return res.json({ message: `Product successfully deleted` });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllProductsByCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { category } = req.params;
    const products = await getProductsByCategory(category);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllProductsByTag = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { tag } = req.params;
    const products = await getProductsByTag(tag);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const sessionToken = req.cookies["COOKIE-AUTH"];
    const [existingUser, product] = await Promise.all([
      getUserBySessionToken(sessionToken),
      getProductById(id),
    ]);

    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    product.set({
      ...req.body,
      lastUpdate: {
        date: new Date(),
        user: existingUser._id,
      },
    });

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
