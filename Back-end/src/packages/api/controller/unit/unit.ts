import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { unitService } from '../../services/unitService';
import validateError from '../../errors/validateError';

export const getAllUnit = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await unitService.getUnitAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all units success',
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

export const getUnit = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await unitService.getUnitById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get units success',
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

export const createUnit = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await unitService.createUnit({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create units success',
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

export const updateUnit = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await unitService.updateUnit(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update units success',
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

export const deleteUnit = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await unitService.deleteUnit(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete units success',
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
