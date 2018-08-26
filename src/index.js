const { scrape } = require('./scraper');
const { write } = require('./writer');

(async () => {
  try {
    const dates = await scrape();
    write(dates);
  } catch (err) {
    console.error(err);
  }
})();
