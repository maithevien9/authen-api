import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';

import { IUser } from '../models';
import configs from '../configs';
import APIError from './APIError';

interface ISignParams {
  _id: IUser['_id'];
}

interface IVerifyReturnPayload extends JwtPayload {
  _id: IUser['_id'];
}

class JWT {
  static sign = (payload: ISignParams): string => {
    return jwt.sign(payload, configs.jwtPrivateKey);
  };

  static get = (req: Request): string => {
    const { authorization } = req.headers;
    let token = '';

    if (authorization) {
      const tokenArr = authorization.split('Bearer ');

      if (Array.isArray(tokenArr) && tokenArr.length === 2) {
        token = tokenArr[1];
      }
    }

    return token;
  };

  static verify = (token: string): IVerifyReturnPayload => {
    try {
      return jwt.verify(token, configs.jwtPrivateKey) as IVerifyReturnPayload;
    } catch (e) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
    }
  };
}

export default JWT;
