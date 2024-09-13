const express = require('express');
const response = require('./response');
const controller = require('../controllers/holidays.controller');
const router = express.Router();

// Raíz prueba
router.get('/', (req, res) => {
  response.success(req, res, 'Holidays', 201);
})

// Saber si el día es festivo
router.get('/is-holiday/:date', (req, res) => {
  const type = 'date';
  const { date } = req.params;

  controller.isHoliday(type, date)
    .then((isHoliday) => {
      response.success(req, res, isHoliday, 201);
    })
    .catch(() => {
      response.error(req, res, 'Información inválida', 400, 'Error en el controlador');
    })
})

// Obtener los festivos del añoç
router.get('/year-holidays/:year', (req, res) => {
  const type = 'year';
  const { year } = req.params;
  const date = `${year}-01-02`;

  controller.isHoliday(type, date)
    .then((isHoliday) => {
      response.success(req, res, isHoliday, 201);
    })
    .catch(() => {
      response.error(req, res, 'Información inválida', 400, 'Error en el controlador');
    })
})

module.exports = router;
