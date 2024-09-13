const express = require('express');
const response = require('./response');
const controller = require('../controllers/holidays.controller');
const router = express.Router();

router.get('/', (req, res) => {
  response.success(req, res, 'Holidays', 201);
})

router.get('/is-holiday/:date', (req, res) => {
  const { date } = req.params;

  controller.isHoliday(date)
    .then((isHoliday) => {
      response.success(req, res, isHoliday, 201);
    })
    .catch(() => {
      response.error(req, res, 'Información inválida', 400, 'Error en el controlador');
    })
})

module.exports = router;
