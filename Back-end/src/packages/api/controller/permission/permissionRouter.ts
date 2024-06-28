import Router from 'express-promise-router';
import { validateToken } from '../../util/jwt';
import { createPermission, deletePermission, getAllPermission, getPermission, updatePermission } from './permission';

const permissionRouter = Router();
permissionRouter.get('/', validateToken, getAllPermission);
permissionRouter.get('/:id', validateToken, getPermission);
permissionRouter.post('/', validateToken, createPermission);
permissionRouter.put('/:id', validateToken, updatePermission);
permissionRouter.delete('/:id', validateToken, deletePermission);

export default permissionRouter;
