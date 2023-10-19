import express from 'express';

const router = express.Router();

const rates = {};

router.get('/', (req, res) => {
  res.render('index', { data: null });
});
router.get('/admin', (req, res) => {
  res.render('admin');
});
router.post('/admin', (req, res) => {
  const { price, date } = req.body;

  if (price && date) {
    rates.price = price;
    rates.date = new Date(date);
    return res.render('admin');
  } else {
    return res.status(400).send('<h1>Wrong data</h1>');
  }
});

export default router;
