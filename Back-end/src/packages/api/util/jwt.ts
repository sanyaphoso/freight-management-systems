import { Request, Response, NextFunction } from 'express';
import config from '~/config';
import { User } from '~/packages/database/models/models';
import * as httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, config.AUTH.TOKEN_SECRET, { expiresIn: '10d' });
};

export const getBodyToken = (token: string) => {
  const decoded = jwt.verify(token, config.AUTH.TOKEN_SECRET);
  return decoded;
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: 'Access denied. No token provided.',
    });
  }

  const parts = header.split(' ');
  /* istanbul ignore next */
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, config.AUTH.TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      /* istanbul ignore next */
      if (error instanceof jwt.TokenExpiredError) {
        res.status(httpStatus.UNAUTHORIZED).json({
          code: httpStatus.UNAUTHORIZED,
          message: 'Token expired.',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(httpStatus.UNAUTHORIZED).json({
          code: httpStatus.UNAUTHORIZED,
          message: 'Invalid token.',
        });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while processing the token.',
        });
      }
    }
  } else {
    /* istanbul ignore next */
    res.status(httpStatus.UNAUTHORIZED).json({
      code: httpStatus.UNAUTHORIZED,
      message: 'Invalid token format.',
    });
  }
};
