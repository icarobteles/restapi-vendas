import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import AppError from "@shared/errors";

async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS,
    });

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "ratelimit",
      points: 5, // Número de solicitações por duration
      duration: 1, // em segundos
    });

    await limiter.consume(request.ip);
    next();
  } catch (error) {
    throw new AppError("Too many requests", 429);
  }
}

export default rateLimiter;
