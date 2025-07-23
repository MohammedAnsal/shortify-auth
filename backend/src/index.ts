import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.routers";
import dbConnect from "./config/db.connection";
import { urlController } from "./controllers/implementations/urlShort.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { authorization } from "./middlewares/authrization.middleware";
import urlRoute from "./routers/urlShort.routers";

dotenv.config();
dbConnect();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/url", urlRoute);

app.get(
  "/:shortUrl",
  // authMiddleware,
  // authorization,
  urlController.redirect.bind(urlController)
);

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
