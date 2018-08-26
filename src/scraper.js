const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

const URL = 'https://www.seiyu.co.jp/service/5off/';

/**
 * Scrape SEIYU 5 percent off sale dates.
 *
 * @return {Promise<Date[]>}
 */
async function scrape() {
  /** @type {Response} */
  const response = await fetch(URL);
  const text = await response.text();
  const { document } = new JSDOM(text).window;

  const items = document.querySelectorAll('.off_calendar_item');

  const dates = Array.from(items).map(item => {
    const month = Number.parseInt(
      item.querySelector('.off_calendar_month').textContent,
      10
    );
    const day = Number.parseInt(
      item.querySelector('.off_calendar_day').textContent,
      10
    );
    return { month, day };
  });

  const maybeNewYear = dates.every(d => d.month === 1 || d.month === 12);
  const currentYear = new Date().getFullYear();

  return dates.map(d => {
    const year = d.month === 1 && maybeNewYear ? currentYear + 1 : currentYear;
    return new Date(year, d.month - 1, d.day);
  });
}

module.exports = { scrape };
