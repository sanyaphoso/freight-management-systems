import Router from 'express-promise-router';
import { validateToken } from '../../util/jwt';
import { addRoleToUser, createRole, deleteRole, getAllRole, getRole, getRolesByUserId, updateRole, updateRoleToUser } from './role';

const roleRouter = Router();
roleRouter.get('/', validateToken, getAllRole);
roleRouter.get('/:id', validateToken, getRole);
roleRouter.post('/', validateToken, createRole);
roleRouter.put('/:id', validateToken, updateRole);
roleRouter.delete('/:id', validateToken, deleteRole);

roleRouter.post('/add-role-user', validateToken, addRoleToUser);
roleRouter.post('/update-role-user', validateToken, updateRoleToUser);
roleRouter.get('/role-user/:id', validateToken, getRolesByUserId);

export default roleRouter;
