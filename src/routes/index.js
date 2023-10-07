import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('<h1>Igor</h1>');
});

export default router;
