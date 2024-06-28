import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { permissionService } from '../../services/permissionService';
import validateError from '../../errors/validateError';

export const getAllPermission = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await permissionService.getPermissionAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all permission success',
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

export const getPermission = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await permissionService.getPermissionById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get permission success',
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

export const createPermission = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await permissionService.createPermission({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create permission success',
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

export const updatePermission = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await permissionService.updatePermission(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update permission success',
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

export const deletePermission = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await permissionService.deletePermission(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete permission success',
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
