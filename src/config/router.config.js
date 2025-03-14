import express from 'express';
import ConfigService from '../env';
import ApiRouter from '../api/api.router';

const router = express.Router();

router.use(ConfigService.appConfig().apiPrefix, ApiRouter);

export default router;
