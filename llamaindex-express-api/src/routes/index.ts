/** @format */

import { Router } from 'express';
import queryRoutes from './query';

const router = Router();

router.use('/query', queryRoutes);

export default router;

// to run the server, run the following command:
// npx tsc
// node dist/index.js