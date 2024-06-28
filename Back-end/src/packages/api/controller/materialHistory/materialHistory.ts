import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { materialHistoryService } from '../../services/materialHistoryService';
import validateError from '../../errors/validateError';

export const getAllMaterialHistory = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialHistoryService.getMaterialHistoryAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all materialHistory success',
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

export const getMaterialHistory = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialHistoryService.getMaterialHistoryById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get materialHistory success',
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

export const createMaterialHistory = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialHistoryService.createMaterialHistory({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create materialHistory success',
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

export const updateMaterialHistory = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialHistoryService.updateMaterialHistory(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update materialHistory success',
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

export const deleteMaterialHistory = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialHistoryService.deleteMaterialHistory(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete materialHistory success',
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
