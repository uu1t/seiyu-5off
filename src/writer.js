const fs = require('fs');
const path = require('path');

const dayjs = require('dayjs');

/**
 * Write dates as JSON by year in `data` directory.
 *
 * @param {Date[]} dates
 */
function write(dates) {
  const datesByYear = {};
  for (const date of dates) {
    const year = date.getFullYear();
    if (!datesByYear[year]) {
      datesByYear[year] = [];
    }
    datesByYear[year].push(date);
  }

  for (const year of Object.keys(datesByYear)) {
    appendData(year, datesByYear[year]);
  }
}

/**
 * @param {number} year
 * @param {Date[]} dates
 */
function appendData(year, dates) {
  const filepath = path.join(__dirname, '..', 'data', `${year}.json`);
  const data = new Set(readData(filepath));
  for (const date of dates) {
    data.add(dayjs(date).format());
  }
  writeData(filepath, Array.from(data).sort());
}

/**
 * @param {string} filepath
 * @return {string[]}
 */
function readData(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return [];
}

/**
 * @param {string} filepath
 * @param {string[]} dates
 */
function writeData(filepath, dates) {
  fs.writeFileSync(filepath, JSON.stringify(dates, null, 2));
  if (process.env.NODE_ENV !== 'test') {
    console.log('Write', filepath);
  }
}

module.exports = { write };
