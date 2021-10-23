const express = require('express');
const PORT = process.env.PORT || 3001
const app = express();
const jobRouters = require('./routers/jobs-routers');

app.use(jobRouters);

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))