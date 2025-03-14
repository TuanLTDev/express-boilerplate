import express from 'express';
import HealthRouter from './health/health.router';
import MediaRouter from './media/media.router';
import FileRouter from './file/file.router';

const router = new express.Router();

router.use('/health', HealthRouter);
router.use('/media', MediaRouter);
router.use('/files', FileRouter);

export default router;
