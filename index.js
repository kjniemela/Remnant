const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const favicon = require('serve-favicon');

const PORT = 3002;
const ADDR_PREFIX = '/remnant';

const app = express();
app.use(bodyParser.json());

// load routes
const atlasRoutes = require('./routes/atlas')

// load templates
const { homeTemplate, errorTemplate } = require('./templates');

// static files
// app.use(favicon(path.join(__dirname, 'assets/favicon.ico')));
app.use(`${ADDR_PREFIX}/archive`, express.static(path.join(__dirname, 'archive/')));
app.use(`${ADDR_PREFIX}/assets`, express.static(path.join(__dirname, 'assets/')));

app.get(`${ADDR_PREFIX}/`, (req, res) => {
  const html = homeTemplate();
  res.end(html);
});

app.use(`${ADDR_PREFIX}/atlas`, atlasRoutes);

// 404 errors
app.use((req, res) => {
  res.status(404);
  res.end(errorTemplate({ code: 404 }));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
