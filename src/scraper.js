const { JSDOM } = require('jsdom')
const fetch = require('node-fetch')

const URL = 'https://www.seiyu.co.jp/service/5off/'

/**
 * Scrape SEIYU 5 percent off sale dates.
 *
 * @param {Date} [now]
 * @return {Promise<Date[]>}
 */
async function scrape(now = new Date()) {
  /** @type {Response} */
  const response = await fetch(URL)
  const text = await response.text()
  const { document } = new JSDOM(text).window

  const items = document.querySelectorAll('.off_calendar_item')

  const dates = Array.from(items).map(item => {
    const month = Number.parseInt(item.querySelector('.off_calendar_month').textContent, 10)
    const day = Number.parseInt(item.querySelector('.off_calendar_day').textContent, 10)
    return { month, day }
  })

  // Handle dates in next year when it's in November and December
  const maybeNewYear = now.getMonth() >= 10
  const currentYear = now.getFullYear()

  return dates.map(d => {
    const year = d.month <= 2 && maybeNewYear ? currentYear + 1 : currentYear
    return new Date(year, d.month - 1, d.day)
  })
}

module.exports = { scrape }
