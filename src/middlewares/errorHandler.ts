import { NextFunction, Request, Response } from "express";
import multer from "multer";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { logger } from "../libs/logger";

/** 404 for unknown API routes */
export const notFound = (req: Request, res: Response) => {
  res.status(HTTPCode.NOT_FOUND).json({ code: HTTPCode.NOT_FOUND, message: Message.NO_DATA_FOUND });
};

/**
 * Central error handler. Express 5 forwards rejected promises from async
 * handlers here, so controllers just `throw` and never repeat try/catch blocks.
 * Unknown errors are logged server-side and answered with a generic 500.
 */
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let error: Errors;
  if (err instanceof Errors) {
    error = err;
  } else if (err instanceof multer.MulterError) {
    error = new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_FILE);
  } else if ((err as { type?: string })?.type === "entity.parse.failed") {
    error = new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_INPUT);
  } else {
    logger.error("Unhandled request error", { method: req.method, path: req.originalUrl, err });
    error = Errors.standard;
  }

  if (res.headersSent) return;
  res.status(error.code).json(error);
};
