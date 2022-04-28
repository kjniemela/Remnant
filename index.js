const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3002;
const ADDR_PREFIX = '/remnant';

const path = require('path');
app.use(bodyParser.json());
app.use(`${ADDR_PREFIX}/`, express.static(path.join(__dirname, 'archive/')));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
