import express from "express";
import cors from "cors";
import registerRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

// receives an object of app and initializes it
const initialize = (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Serve uploaded images statically
  app.use('/', express.static('public'));

  app.use(cookieParser());

  // Initialize Routes
  registerRouter(app);
};

export default initialize;