const fs = require('fs')
const path = require('path')
const vm = require('vm')

global.UrlFetchApp = { fetch: jest.fn() }

const globalContext = vm.createContext(global)
const content = fs.readFileSync(path.join(__dirname, '..', 'index.js'))
vm.runInContext(content, globalContext, { filename: 'index.js' })

class HTTPResponse {
  /**
   * @param {number} responseCode
   * @param {any} content
   */
  constructor(responseCode, content) {
    this.responseCode = responseCode
    this.content = content
  }

  /**
   * @return {number}
   */
  getResponseCode() {
    return this.responseCode
  }

  /**
   * @return {string}
   */
  getContentText() {
    return JSON.stringify(this.content)
  }
}

describe('fetchDates()', () => {
  beforeEach(() => {
    UrlFetchApp.fetch.mockReset()
  })

  it('fetches dates', () => {
    const response = new HTTPResponse(200, [new Date(2006, 1, 2), new Date(2006, 1, 3)])
    UrlFetchApp.fetch.mockReturnValue(response)

    const dates = fetchDates(2006)
    expect(dates).toEqual(response.content)
  })

  it('mutes only 404 HTTP response', () => {
    const response404 = new HTTPResponse(404)
    const response503 = new HTTPResponse(503)
    UrlFetchApp.fetch.mockReturnValueOnce(response404).mockReturnValueOnce(response503)

    expect(() => {
      fetchDates(2006, true)
    }).not.toThrow()

    expect(() => {
      fetchDates(2006, true)
    }).toThrow(/503/)
  })
})
