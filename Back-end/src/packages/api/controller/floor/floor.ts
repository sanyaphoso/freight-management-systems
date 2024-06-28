import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { floorService } from '../../services/floorService';
import { randomUUID } from 'crypto';
import validateError from '../../errors/validateError';

export const getAllFloor = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await floorService.getFloorAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all floors success',
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

export const getFloor = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await floorService.getFloorById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get floors success',
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

export const getFloorsByShelfId = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await floorService.getFloorsByShelfId(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get floors success',
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

export const createFloor = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  let fileName = '';
  if (!Array.isArray(req.files.image_url)) {
    fileName = randomUUID() + '.' + req.files.image_url.name.split('.').pop();
    req.files.image_url.mv('src/upload/' + fileName, (err) => {
      if (err) console.error('error:', err);
    });
    req.body.image_url = fileName;
  }

  try {
    const rsp = await floorService.createFloor({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create floors success',
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

export const updateFloor = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  let fileName = '';
  if (!Array.isArray(req.files.image_url)) {
    fileName = randomUUID() + '.' + req.files.image_url.name.split('.').pop();
    req.files.image_url.mv('src/upload/' + fileName, (err) => {
      if (err) console.error('error:', err);
    });
    req.body.image_url = fileName;
  }

  try {
    const rsp = await floorService.updateFloor(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update floors success',
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

export const deleteFloor = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await floorService.deleteFloor(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete floors success',
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
