import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { lotService } from '../../services/lotService';
import validateError from '../../errors/validateError';

export const getLotAll = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await lotService.getLotAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all lot success',
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

export const getLotByMaterialId = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await lotService.getLotByMaterialId(Number(req.params.material_id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get lot by material id success',
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

export const depositLot = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await lotService.depositLot(
      Number(req.body.material_id),
      {
        name: req.body.name as string,
        buy_date: req.body.buy_date,
        price: req.body.price,
        amount: req.body.amount,
        detail: req.body.detail,
      },
      req.user.id,
    );
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'deposit lot success',
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

export const withdrawLot = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await lotService.withdrawLot(Number(req.body.material_id), Number(req.body.amount), req.user.id);
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'withdraw lot success',
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
