import * as express from 'express';
import {
  authRouter,
  userRouter,
  lotRouter,
  shelfRouter,
  floorRouter,
  unitRouter,
  materialRouter,
  materialHistoryRouter,
  orderGroupRouter,
  orderRouter,
  permissionRouter,
  roleRouter,
} from './controller/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const router = express.Router();

const uploadDirectory = path.join(__dirname, '../../upload');

router.use('/upload', express.static(uploadDirectory));
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/lot', lotRouter);
router.use('/shelf', shelfRouter);
router.use('/floor', floorRouter);
router.use('/unit', unitRouter);
router.use('/material', materialRouter);
router.use('/material-history', materialHistoryRouter);
router.use('/order', orderRouter);
router.use('/order-group', orderGroupRouter);
router.use('/permission', permissionRouter);
router.use('/role', roleRouter);

export default router;
