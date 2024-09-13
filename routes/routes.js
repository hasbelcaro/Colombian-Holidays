const express = require('express');

const holidays = require('./holidays.routes');

const routes = function (server) {
  server.use('/holidays', holidays);
}

module.exports = routes;
