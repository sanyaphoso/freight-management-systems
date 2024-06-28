import Router from 'express-promise-router';
import { validateToken } from '../../util/jwt';
import { changeStatusInprogress, changeStatusSuccess, createOrder, deleteOrder, getAllOrder, getOrder, updateOrder } from './order';

const orderRouter = Router();
orderRouter.get('/', validateToken, getAllOrder);
orderRouter.get('/:id', validateToken, getOrder);
orderRouter.post('/', validateToken, createOrder);
orderRouter.put('/:id', validateToken, updateOrder);
orderRouter.delete('/:id', validateToken, deleteOrder);

orderRouter.post('/in-progress/:id', validateToken, changeStatusInprogress);
orderRouter.post('/success/:id', validateToken, changeStatusSuccess);

export default orderRouter;
