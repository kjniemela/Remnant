const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

const path = require('path');
app.use(bodyParser.json());
app.use('/gaia', express.static(path.join(__dirname, 'dist/')));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
