const express = require('express');
const PORT = process.env.PORT || 3001
const app = express();

app.get('/', (req, res) => {
    res.send("EMansion API");
})

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))