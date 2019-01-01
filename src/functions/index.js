var baseUrl = 'https://raw.githubusercontent.com/uu1t/seiyu-5off/master/data/'
var id = '0s95g7m3irrcrabge49tlk6so0@group.calendar.google.com'

/**
 * schedule: every day 04:00
 */
function main() {
  var now = new Date()

  var dates = fetchDates(now.getFullYear())
  // In November or December, fetch next year's data
  if (now.getMonth() >= 10) {
    dates.concat(fetchDates(now.getFullYear() + 1, true))
  }
  // Exclude past dates
  dates = dates.filter(function(date) {
    return date.getTime() > now.getTime()
  })
  Logger.log(dates)

  var calendar = CalendarApp.getCalendarById(id)
  createSaleEvents(calendar, dates)
}

/**
 * @param {number} year
 * @param {boolean} mute404
 * @return {Date[]}
 */
function fetchDates(year, mute404) {
  mute404 = Boolean(mute404)
  var url = baseUrl + String(year) + '.json'
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: mute404 })
  var responseCode = response.getResponseCode()

  if (mute404 && responseCode >= 400) {
    if (responseCode !== 404) {
      throw new Error('Request failed for ' + url + ' returned code ' + responseCode)
    }
    return []
  }

  var contentText = response.getContentText()
  /** @type {string[]} */
  var dateStrings = JSON.parse(contentText)
  return dateStrings.map(function(dateString) {
    return new Date(dateString)
  })
}

/**
 * @param {GoogleAppsScript.Calendar.Calendar} calendar
 * @param {Date[]} dates
 */
function createSaleEvents(calendar, dates) {
  dates.forEach(function(date) {
    var events = calendar.getEventsForDay(date)
    if (events.length === 0) {
      calendar.createAllDayEvent('西友5%OFF', date)
      Logger.log('Create at ' + date.toLocaleString())
    }
  })
}
