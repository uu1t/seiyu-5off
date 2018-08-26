const path = require('path');

jest.mock('fs');
const fs = require('fs');
const { write } = require('../writer');

function filepath(year) {
  return path.join(__dirname, '..', '..', 'data', `${year}.json`);
}

describe('.write()', () => {
  beforeEach(() => {
    fs.__reset();
  });

  it('writes dates', () => {
    const dates = [new Date(2006, 0, 2), new Date(2006, 0, 3)];
    write(dates);

    const written = JSON.parse(fs.readFileSync(filepath(2006)));
    expect(written).toEqual([
      '2006-01-02T00:00:00+09:00',
      '2006-01-03T00:00:00+09:00'
    ]);
  });

  it('write dates of different years', () => {
    const dates = [new Date(2006, 0, 2), new Date(2007, 0, 3)];
    write(dates);

    const written1 = JSON.parse(fs.readFileSync(filepath(2006)));
    expect(written1).toEqual(['2006-01-02T00:00:00+09:00']);

    const written2 = JSON.parse(fs.readFileSync(filepath(2007)));
    expect(written2).toEqual(['2007-01-03T00:00:00+09:00']);
  });

  it('does not write duplicated dates', () => {
    fs.writeFileSync(
      filepath(2006),
      `[
  "2006-01-02T00:00:00+09:00",
  "2006-01-03T00:00:00+09:00"
]`
    );

    const dates = [new Date(2006, 0, 3), new Date(2006, 0, 4)];
    write(dates);

    const written = JSON.parse(fs.readFileSync(filepath(2006)));
    expect(written).toEqual([
      '2006-01-02T00:00:00+09:00',
      '2006-01-03T00:00:00+09:00',
      '2006-01-04T00:00:00+09:00'
    ]);
  });
});
