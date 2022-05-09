const pug = require('pug');

// compile templates
module.exports = {
  errorTemplate: pug.compileFile('templates/error.pug'),
  homeTemplate: pug.compileFile('templates/home.pug'),
  atlasTemplate: pug.compileFile('templates/atlas.pug'),
  countriesTemplate: pug.compileFile('templates/countries.pug'),
  countryTemplate: pug.compileFile('templates/country.pug'),
  locationTemplate: pug.compileFile('templates/location.pug'),
  cityTemplate: pug.compileFile('templates/city.pug'),
  islandTemplate: pug.compileFile('templates/island.pug'),
}