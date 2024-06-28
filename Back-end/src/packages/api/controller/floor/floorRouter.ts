import Router from 'express-promise-router';
import { validateToken } from '../../util/jwt';
import { createFloor, deleteFloor, getAllFloor, getFloor, getFloorsByShelfId, updateFloor } from './floor';

const floorRouter = Router();
floorRouter.get('/', validateToken, getAllFloor);
floorRouter.get('/:id', validateToken, getFloor);
floorRouter.get('/shelf/:id', validateToken, getFloorsByShelfId);
floorRouter.post('/', validateToken, createFloor);
floorRouter.put('/:id', validateToken, updateFloor);
floorRouter.delete('/:id', validateToken, deleteFloor);

export default floorRouter;
