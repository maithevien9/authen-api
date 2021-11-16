// eslint-disable-next-line max-classes-per-file
import httpStatus from 'http-status';
import { IError } from '../types';

class ExtendableError extends Error {
  public code?: number;

  public status: number;

  public errors: any;

  constructor(e: IError) {
    super(e.message);
    this.name = this.constructor.name;
    this.message = e.message;
    this.code = e.code;
    this.errors = e.errors;
    this.status = e.status;
    this.stack = e.stack;
  }
}

class APIError extends ExtendableError {
  constructor({ message, status = httpStatus.INTERNAL_SERVER_ERROR }: IError) {
    super({
      message,
      status,
    });
  }
}

export default APIError;
