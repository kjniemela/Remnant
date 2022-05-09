const express = require('express');
const router = express.Router();

const {
  errorTemplate,
  homeTemplate,
  atlasTemplate,
  countriesTemplate,
  countryTemplate,
  locationTemplate,
  cityTemplate,
  islandTemplate
} = require('../templates');

const {
  descs,
  countries,
  cities,
  languages,
  locations,
  islands
} = require('../data');

router.get('/', (req, res) => {
  const html = atlasTemplate({
    countries,
    cities,
    islands,
  });
  res.end(html);
});

router.get('/countries', (req, res) => {
  const html = countriesTemplate({
    countries,
  });
  res.end(html);
});

router.get('/countries/:country', (req, res) => {
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

router.get('/countries/:country/:location', (req, res) => {
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

router.get('/cities/:city', (req, res) => {
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

router.get('/islands/:island', (req, res) => {
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

module.exports = router;