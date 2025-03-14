import express from 'express';
import MediaController from './media.controller';

const router = new express.Router();
router.post('/download', MediaController.test);

export default router;
