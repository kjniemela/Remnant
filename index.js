const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const pug = require('pug');

const PORT = 3002;
const ADDR_PREFIX = '/remnant';

const app = express();
app.use(bodyParser.json());

// compile templates
const homeTemplate = pug.compileFile('templates/home.pug');

const path = require('path');
app.use(favicon(path.join(__dirname, 'assets/favicon.ico')));
app.use(`${ADDR_PREFIX}/archive`, express.static(path.join(__dirname, 'archive/')));
app.use(`${ADDR_PREFIX}/assets`, express.static(path.join(__dirname, 'assets/')));

app.get(`${ADDR_PREFIX}/`, (req, res) => {
  const html = homeTemplate({
    name: 'World'
  });
  res.end(html);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
