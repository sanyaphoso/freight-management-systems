import Router from 'express-promise-router';
import { validateToken } from '../../util/jwt';
import { changeStatusInprogress, changeStatusSuccess, createOrderGroup, deleteOrderGroup, getAllOrderGroup, getOrderGroup, updateOrderGroup } from './orderGroup';

const orderGroupRouter = Router();
orderGroupRouter.get('/', validateToken, getAllOrderGroup);
orderGroupRouter.get('/:id', validateToken, getOrderGroup);
orderGroupRouter.post('/', validateToken, createOrderGroup);
orderGroupRouter.put('/:id', validateToken, updateOrderGroup);
orderGroupRouter.delete('/:id', validateToken, deleteOrderGroup);

orderGroupRouter.post('/in-progress/:id', validateToken, changeStatusInprogress);
orderGroupRouter.post('/success/:id', validateToken, changeStatusSuccess);

export default orderGroupRouter;
