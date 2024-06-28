import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { orderService } from '../../services/orderService';
import validateError from '../../errors/validateError';

export const getAllOrder = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.getOrderAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get all orders success',
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

export const getOrder = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.getOrderById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'get orders success',
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

export const createOrder = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.createOrder({ ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'create orders success',
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

export const updateOrder = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.updateOrder(Number(req.params.id), { ...req.body });
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'update orders success',
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

export const deleteOrder = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.deleteOrder(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'delete orders success',
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

export const changeStatusInprogress = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.updateStatusInProgress(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Update status orders success',
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

export const changeStatusSuccess = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await orderService.updateStatusSuccess(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Update status orders success',
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
