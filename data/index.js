const fs = require('fs');
const path = require('path');

// load json data
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'countries.json')));
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json')));
const languages = JSON.parse(fs.readFileSync(path.join(__dirname, 'languages.json')));
const locations = JSON.parse(fs.readFileSync(path.join(__dirname, 'locations.json')));
const islands = JSON.parse(fs.readFileSync(path.join(__dirname, 'islands.json')));

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
const descFiles = fs.readdirSync(path.join(__dirname, 'descs'));
for (const fileName of descFiles) {
  descs[path.parse(fileName).name] = fs.readFileSync(path.join(__dirname, 'descs/', fileName)).toString();
}

module.exports = {
  descs,
  countries,
  cities,
  languages,
  locations,
  islands
};