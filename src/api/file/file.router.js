import express from 'express';
import FileController from './file.controller';

const router = new express.Router();
router.get('/:hashString', FileController.getFile);

export default router;
