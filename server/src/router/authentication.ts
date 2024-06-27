import express from "express";

import { googleRegister, login, register } from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/google/register", googleRegister);
  router.post("/auth/login", login);
};
