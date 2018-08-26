const fetch = require('node-fetch');

const scraper = require('../scraper');

function html(month) {
  const nextMonth = month === 12 ? 1 : month + 1;
  return `
<div class="off_calendar">
  <div class="off_calendar_inner">
    <ul class="off_calendar_list">
      <li class="off_calendar_item"><span class="off_calendar_month">${month}/</span><span class="off_calendar_day">1</span><span class="off_calendar_week">（土）</span></li>
      <li class="off_calendar_item"><span class="off_calendar_month">${month}/</span><span class="off_calendar_day">8</span><span class="off_calendar_week">（土）</span></li>
    </ul>
    <ul class="off_calendar_list">
      <li class="off_calendar_item"><span class="off_calendar_month">${nextMonth}/</span><span class="off_calendar_day">2</span><span class="off_calendar_week">（土）</span></li>
      <li class="off_calendar_item"><span class="off_calendar_month">${nextMonth}/</span><span class="off_calendar_day">9</span><span class="off_calendar_week">（土）</span></li>
    </ul>
  </div>
</div>
  `.trim();
}

const year = new Date().getFullYear();

describe('.scrape()', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('extracts sale dates', async () => {
    fetch.once(html(1)).once(html(11));

    let dates = await scraper.scrape();
    expect(dates).toEqual([
      new Date(year, 1 - 1, 1),
      new Date(year, 1 - 1, 8),
      new Date(year, 2 - 1, 2),
      new Date(year, 2 - 1, 9)
    ]);

    dates = await scraper.scrape();
    expect(dates).toEqual([
      new Date(year, 11 - 1, 1),
      new Date(year, 11 - 1, 8),
      new Date(year, 12 - 1, 2),
      new Date(year, 12 - 1, 9)
    ]);
  });

  it('extracts sale dates in December', async () => {
    fetch.once(html(12));

    const dates = await scraper.scrape();
    expect(dates).toEqual([
      new Date(year, 12 - 1, 1),
      new Date(year, 12 - 1, 8),
      new Date(year + 1, 1 - 1, 2),
      new Date(year + 1, 1 - 1, 9)
    ]);
  });
});
