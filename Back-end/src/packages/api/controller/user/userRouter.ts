import Router from 'express-promise-router';
import { userInfo, userList } from './user';
import { validateToken } from '../../util/jwt';

const userRouter = Router();
userRouter.get('/user', validateToken, userList);
userRouter.get('/user-info', validateToken, userInfo);

export default userRouter;
