import { info, error } from "./logger.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const reqLogger = (req, res, next) => {
  info("Method:", req.method);
  info("Path:  ", req.path);
  info("Body:  ", req.body);
  info("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    return res.status(401).send({ error: "token missing" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken.id) {
    return res.status(401).send({
      error: "token invalid",
    });
  }

  req.user = await User.findById(decodedToken.id);
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({
      error: "expected `username` to be unique",
    });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

export default {
  reqLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
