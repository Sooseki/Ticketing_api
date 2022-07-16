import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../classes/Errors/ApiError';
import { ErrorCode } from '../classes/Errors/ErrorCode';
import { LogError } from '../classes/Logging/Log';

export const DefaultErrorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {

  let err = new ApiError(ErrorCode.InternalError, 'internal/unknown', 'An unknown internal error occurred');

  if (!!error) {
    if (error instanceof ApiError) {
      err = error;
    }
    else if (!!error.sql) {
      err = new ApiError(ErrorCode.BadRequest, 'sql/failed', error.message, {
        sqlState: error.sqlState,
        sqlCode: error.code
      });
    } else {
      if (error.message) {
        err.message = error.message;
      }
    }
  }

  err.path = req.originalUrl;
  LogError(error.message, err.json);

  res.status(err.code).json(err.json);

}
