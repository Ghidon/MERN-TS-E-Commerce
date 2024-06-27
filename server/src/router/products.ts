import express from "express";

import {
  createOneProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  getAllProductsByCategory,
  getAllProductsByTag,
  updateProduct,
} from "../controllers/products";
// import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.post("/products/create", createOneProduct);
  router.get("/products", getAllProducts);
  router.get("/products/category/:category", getAllProductsByCategory);
  router.get("/products/tag/:tag", getAllProductsByTag);
  router.get("/products/:id", getProduct);
  router.delete("/products/:id", deleteProduct);
  router.patch("/products/:id", updateProduct);
  // get all products by categories
  // get all products by tags
  // get all products by tags and categories, multiple filters
  // get product by name
  // sort products by price
  // get all published/unpublished
  // get all deleted/undeleted
  // get all products below specific price
};
