const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const pug = require('pug');

const PORT = 3002;
const ADDR_PREFIX = '/remnant';

const app = express();
app.use(bodyParser.json());

// load json data
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/countries.json')));
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/cities.json')));
const languages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/languages.json')));
const locations = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/locations.json')));
const islands = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/islands.json')));

// connect some data
for (const country in countries) {
  countries[country].cities = [];
  for (const island of countries[country].islands) {
    islands[island].country = country;
    for (const city of islands[island].cities) {
      if (cities[city]) {
        cities[city].island = island;
        countries[country].cities.push(city);
      } else {
        console.error('Missing city:', city);
      }
    }
  }
  for (const city of countries[country].cities) {
    cities[city].country = country;
  }
  for (const location of countries[country].locations) {
    locations[location].country = country;
  }
}

// read markdown descriptions
const descs = {};
const descFiles = fs.readdirSync(path.join(__dirname, 'data/descs'));
for (const fileName of descFiles) {
  descs[path.parse(fileName).name] = fs.readFileSync(path.join(__dirname, 'data/descs/', fileName)).toString();
}

// compile templates
const errorTemplate = pug.compileFile('templates/error.pug');
const homeTemplate = pug.compileFile('templates/home.pug');
const atlasTemplate = pug.compileFile('templates/atlas.pug');
const countriesTemplate = pug.compileFile('templates/countries.pug');
const countryTemplate = pug.compileFile('templates/country.pug');
const locationTemplate = pug.compileFile('templates/location.pug');
const cityTemplate = pug.compileFile('templates/city.pug');
const islandTemplate = pug.compileFile('templates/island.pug');


app.use(favicon(path.join(__dirname, 'assets/favicon.ico')));
app.use(`${ADDR_PREFIX}/archive`, express.static(path.join(__dirname, 'archive/')));
app.use(`${ADDR_PREFIX}/assets`, express.static(path.join(__dirname, 'assets/')));

app.get(`${ADDR_PREFIX}/`, (req, res) => {
  const html = homeTemplate();
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas`, (req, res) => {
  const html = atlasTemplate({
    countries,
    cities,
    islands,
  });
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas/countries`, (req, res) => {
  const html = countriesTemplate({
    countries,
  });
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas/countries/:country`, (req, res) => {
  const pathName = req.params.country;
  const country = countries[pathName];
  let html;
  if (country) {
    try {
      html = countryTemplate({
        title: country.name,
        desc: descs[pathName] || 'Error: Description Missing',
        country,
        cities,
        languages,
        locations,
        islands,
        pathName,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      html = errorTemplate({ code: 500 });
    }
  } else {
    res.status(404);
    html = errorTemplate({ code: 404 });
  }
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas/countries/:country/:location`, (req, res) => {
  const pathName = req.params.location;
  const location = locations[pathName];
  let html;
  if (location) {
    try {
      html = locationTemplate({
        title: location.name,
        desc: descs[pathName] || 'Error: Description Missing',
        location,
        countries,
        cities,
        languages,
        locations,
        islands,
        pathName,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      html = errorTemplate({ code: 500 });
    }
  } else {
    res.status(404);
    html = errorTemplate({ code: 404 });
  }
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas/cities/:city`, (req, res) => {
  const pathName = req.params.city;
  const city = cities[pathName];
  let html;
  if (city) {
    try {
      html = cityTemplate({
        title: city.name,
        desc: descs[pathName] || 'Error: Description Missing',
        city,
        countries,
        islands,
        cities,
        languages,
        locations,
        pathName,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      html = errorTemplate({ code: 500 });
    }
  } else {
    res.status(404);
    html = errorTemplate({ code: 404 });
  }
  res.end(html);
});

app.get(`${ADDR_PREFIX}/atlas/islands/:island`, (req, res) => {
  const pathName = req.params.island;
  const island = islands[pathName];
  let html;
  if (island) {
    try {
      html = islandTemplate({
        title: island.name,
        desc: descs[pathName] || 'Error: Description Missing',
        island,
        countries,
        cities,
        languages,
        locations,
        pathName,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      html = errorTemplate({ code: 500 });
    }
  } else {
    res.status(404);
    html = errorTemplate({ code: 404 });
  }
  res.end(html);
});

// 404 errors
app.use((req, res) => {
  res.status(404);
  res.end(errorTemplate({ code: 404 }));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
