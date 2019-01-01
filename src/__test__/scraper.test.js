const fetch = require('node-fetch')

const scraper = require('../scraper')

function html(...months) {
  return `
<div class="off_calendar">
  <div class="off_calendar_inner">
    ${months
      .map(
        (month, i) => `
        <ul class="off_calendar_list">
          <li class="off_calendar_item"><span class="off_calendar_month">${month}/</span><span class="off_calendar_day">${i +
          1}</span><span class="off_calendar_week">（土）</span></li>
          <li class="off_calendar_item"><span class="off_calendar_month">${month}/</span><span class="off_calendar_day">${i +
          8}</span><span class="off_calendar_week">（土）</span></li>
        </ul>`
      )
      .join('')}
  </div>
</div>
  `.trim()
}

const year = new Date().getFullYear()

describe('.scrape()', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('extracts sale dates in a month', async () => {
    const months = [1, 2, 11, 12]
    for (const month of months) {
      fetch.once(html(month))

      const dates = await scraper.scrape(new Date(year, month - 1))
      expect(dates).toEqual([new Date(year, month - 1, 1), new Date(year, month - 1, 8)])
    }
  })

  it('extracts sale dates in months', async () => {
    const monthsList = [[1, 2], [2, 3], [11, 12]]
    for (const months of monthsList) {
      fetch.once(html(...months))

      const dates = await scraper.scrape(new Date(year, months[0] - 1))
      expect(dates).toEqual([
        new Date(year, months[0] - 1, 1),
        new Date(year, months[0] - 1, 8),
        new Date(year, months[1] - 1, 2),
        new Date(year, months[1] - 1, 9)
      ])
    }
  })

  it('extracts sale dates in December and January', async () => {
    fetch.once(html(12, 1))

    const dates = await scraper.scrape(new Date(year, 12 - 1))
    expect(dates).toEqual([
      new Date(year, 12 - 1, 1),
      new Date(year, 12 - 1, 8),
      new Date(year + 1, 1 - 1, 2),
      new Date(year + 1, 1 - 1, 9)
    ])
  })
})
