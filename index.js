const express = require('express');
const app = express();
const port = 3000;

const router = require('./routes/routes');
router(app);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
})
