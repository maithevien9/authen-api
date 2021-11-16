import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { IError } from '../types';

interface IResponseError {
  message: string;
  status: number;
  errors?: any;
}

const responseError = (res: Response, error: IResponseError) => {
  res.status(error.status).json(error);
};

const handler = (
  err: IError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let error = {
    message: err.message,
    status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
  } as IResponseError;

  if (err.details) {
    error = {
      message: 'Validation error!',
      status: err.status || httpStatus.BAD_REQUEST,
      errors: err.details.body || err.details.query || err.details.params,
    };
  }

  return responseError(res, error);
};

const routeNotFound = (req: Request, res: Response) => {
  const error = {
    message: 'API not found!',
    status: httpStatus.NOT_FOUND,
  };

  return responseError(res, error);
};

export default {
  routeNotFound,
  handler,
};
