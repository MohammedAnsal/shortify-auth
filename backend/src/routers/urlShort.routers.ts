import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorization } from "../middlewares/authrization.middleware";
import { urlController } from "../controllers/implementations/urlShort.controller";

const urlRoute = express.Router();

urlRoute.post(
  "/shortUrl",
  authMiddleware,
  authorization,
  urlController.shortUrl.bind(urlController)
);

urlRoute.get(
  "/getAll",
  authMiddleware,
  authorization,
  urlController.getUserUrls.bind(urlController)
);

export default urlRoute;
