import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import { ordersGroupService } from '../../services/orderGroupService';
import validateError from '../../errors/validateError';

export const getAllOrderGroup = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await ordersGroupService.getOrdersGroupAll();
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Get all orders success',
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

export const getOrderGroup = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await ordersGroupService.getOrdersGroupById(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Get orders success',
      data: rsp,
    });
  } catch (error) {
    /* istanbul ignore next */
    const { message, code } = validateError(error);
    return res.status(code).json({ message, code });
  }
};

export const createOrderGroup = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const ids = req.body.orders_ids.split(',').map(Number);
    const rsp = await ordersGroupService.createOrdersGroup(ids, req.body.node);
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Create orders success',
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

export const updateOrderGroup = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const ids = req.body.orders_ids.split(',').map(Number);
    const rsp = await ordersGroupService.updateOrdersGroup(Number(req.params.id), ids, req.body.node);
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Update orders success',
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

export const deleteOrderGroup = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await ordersGroupService.deleteOrdersGroup(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Delete orders group success',
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

export const changeStatusInprogress = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await ordersGroupService.updateStatusInProgress(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Update status orders group success',
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

export const changeStatusSuccess = async (req: Request, res: Response, _: NextFunction): Promise<any> => {
  try {
    const rsp = await ordersGroupService.updateStatusSuccess(Number(req.params.id));
    return res.status(httpStatus.OK).json({
      code: 200,
      message: 'Update status orders group success',
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
