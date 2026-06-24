# Average People

Imagine you could pick a random person. Who would they be? What would their lives look like? This project aims to help explore these question and move us towards a more accurate picture of what the real world population looks like.

Currently it only picks the location based on the population density of the world, but many more data points are planned. If you are interested in contributing, feel free to open an issue or reach out to me!

Enjoy!

## Usage

prerequisites:
- node.js
- npm

install:
```bash
git clone https://github.com/FelixMo42/average_people
cd average_people
npm install
```

usage:
```bash
npm run person
```

example output:
```json
{
    lon: 24.028331173076737,
    lat: -10.91891826035912,
    country_code: 'zm',
    'ISO3166-2-lvl4': 'ZM-06'
}
```

## Data Used

- Geospatial Population Data[^1]
- OpenStreetMap's nominatim reverse geocoding services[^2]
- Population data per country (used for validation)[^3]

[^1]: Bondarenko M., Priyatikanto R., Tejedor-Garavito N., Zhang W., McKeen T., Cunningham A., Woods T., Hilton J., Cihan D., Nosatiuk B., Brinkhoff T., Tatem A., Sorichetta A.. 2025. The spatial distribution of population in 2015-2030 at a resolution of 30 arc (approximately 1km at the equator) R2025A version v1. Global Demographic Data Project - Funded by The Bill and Melinda Gates Foundation (INV-045237). WorldPop - School of Geography and Environmental Science, University of Southampton. DOI:10.5258/SOTON/WP00845
[^2]: Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright
[^3]: List of countries and dependencies by population (2026, June 23) https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population

