const { scrape } = require('./scraper');
const { write } = require('./writer');

(async () => {
  const dates = (await scrape().catch(err => console.error(err))) || [];
  if (dates.length === 0) {
    process.exit(1);
  }
  console.log('Scrape', ...dates);
  write(dates);
})();
