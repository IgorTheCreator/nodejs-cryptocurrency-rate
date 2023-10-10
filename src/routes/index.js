import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.render('index');
});

export default router;
