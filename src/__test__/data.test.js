const fs = require('fs')
const path = require('path')

test('data file format', () => {
  const datadir = path.join(__dirname, '..', '..', 'data')
  const files = fs.readdirSync(datadir)

  expect(files.length).toBeGreaterThan(0)

  for (const file of files) {
    expect(file).toMatch(/^\d{4}\.json$/)

    const data = fs.readFileSync(path.join(datadir, file), 'utf8')

    let dates = []
    expect(() => {
      dates = JSON.parse(data)
    }).not.toThrow()

    expect(dates).toEqual(expect.any(Array))

    const year = Number(file.replace(/\.json$/, ''))
    for (const dateString of dates) {
      const date = new Date(dateString)
      expect(date.getFullYear()).toEqual(year)
    }
  }
})
