import express from 'express';

const router = new express.Router();
router.get('/', (req, res) => {
    res.status(200).send('OK');
});
export default router;
