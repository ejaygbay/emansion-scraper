const express = require('express');
const routers = express.Router();
const jobControllers = require('../controllers/jobs-controller');

routers.get('/', jobControllers);

module.exports = routers;