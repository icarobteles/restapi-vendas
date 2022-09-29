import AppError from "@shared/errors";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "@config/auth";

interface IDecodedToken {
  iat: number;
  exp: number;
  sub: string;
}

function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT Token is missing.", 401);
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2) {
    throw new AppError("Token error", 401);
  }

  const [type, token] = tokenParts;

  if (!/^Bearer$/i.test(type)) {
    throw new AppError("Malformatted token", 401);
  }

  try {
    const { secret } = authConfig.jwt;

    const decodedToken = verify(token, secret);

    const { sub } = decodedToken as IDecodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid token", 498);
  }
}

export default isAuthenticated;
