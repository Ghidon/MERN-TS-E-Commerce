import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import router from "./router";
import mongoose from "mongoose";

const app = express();
dotenv.config();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL).then(() =>
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
  })
);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
