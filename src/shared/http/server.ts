import "reflect-metadata";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors"; // Trata as exceções geradas a partir de uma função assícrona na requisição, possibilitando que os erros sejam tratados por AppError
import cors from "cors";
import routes from "./routes";
import AppError from "@shared/errors";
import "@shared/typeorm";
import { errors } from "celebrate";
import uploadConfig from "@config/upload";
import isAuthenticated from "./middlewares/isAuthenticated";
import { pagination } from "typeorm-pagination";
import rateLimiter from "@shared/http/middlewares/rateLimiter";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(pagination);

// /files/{filename}
app.use("/files", isAuthenticated, express.static(uploadConfig.directory));

app.use(routes);

app.use(errors());

// MIDDLEWARE QUE INTERCEPTA OS ERROS
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ status: "error", message: error.message });
  }

  return res
    .status(500)
    .json({ status: "error", message: "Internal server error" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}! 👀`);
});
