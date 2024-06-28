import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { materialService } from '../../services/materialService';
import { randomUUID } from 'crypto';
import validateError from '../../errors/validateError';

export const getAllMaterial = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialService.getMaterialAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all material success',
      data: rsp,
    });
  } catch (error) {
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};

export const getMaterial = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialService.getMaterialById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get material success',
      data: rsp,
    });
  } catch (error) {
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};

export const createMaterial = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  let fileName = '';
  if (!Array.isArray(req.files.image_url)) {
    fileName = randomUUID() + '.' + req.files.image_url.name.split('.').pop();
    req.files.image_url.mv('src/upload/' + fileName, (err) => {
      if (err) console.error('error:', err);
    });
    req.body.image_url = fileName;
  }

  try {
    const rsp = await materialService.createMaterial({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create material success',
      data: rsp,
    });
  } catch (error) {
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};

export const updateMaterial = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  let fileName = '';
  if (!Array.isArray(req.files.image_url)) {
    fileName = randomUUID() + '.' + req.files.image_url.name.split('.').pop();
    req.files.image_url.mv('src/upload/' + fileName, (err) => {
      if (err) console.error('error:', err);
    });
    req.body.image_url = fileName;
  }

  try {
    const rsp = await materialService.updateMaterial(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update material success',
      data: rsp,
    });
  } catch (error) {
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};

export const deleteMaterial = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await materialService.deleteMaterial(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete material success',
      data: rsp,
    });
  } catch (error) {
    const { code, message } = validateError(error);
    return res.status(code).json({
      code,
      message,
    });
  }
};
