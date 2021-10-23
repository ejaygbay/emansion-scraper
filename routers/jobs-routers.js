const express = require('express');
const routers = express.Router();
const jobControllers = require('../controllers/jobs-controller');

routers.get('/', jobControllers.getAPIDocumentation);

routers.post('/job', jobControllers.createJob);

routers.patch('/job', jobControllers.editJob);

routers.delete('/job', jobControllers.deleteJob);

module.exports = routers;