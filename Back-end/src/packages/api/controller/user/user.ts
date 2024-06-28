import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { userService } from '../../services/userService';
import validateError from '../../errors/validateError';

export const userList = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await userService.getUserAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Get all user success',
      data: rsp,
    });
  } catch (error) {
    /* istanbul ignore next */
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};

export const userInfo = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await userService.getUserById(req.user.id);
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Get all user info success',
      data: rsp,
    });
  } catch (error) {
    /* istanbul ignore next */
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};
