// yyyy-mm-ddTHH:MM:SS.000Z
// new Date(yyyy, mm, dd, hh, mm, ss, 000)

const getWeek = require('date-fns/getWeek');
const getStart = require('date-fns/startOfWeek');
const getEnd = require('date-fns/lastDayOfWeek');
const addDays = require('date-fns/addDays')
const format = require('date-fns/format');
const formatDistance = require('date-fns/formatDistance');

const today = Date.now();
const nextMon = new Date(2020, 0, 8);
const lastMon = new Date(2019, 11, 31);
console.log(format(today, "MMMM Do yy"));
console.log(nextMon);
console.log(lastMon);
const getWeekDates = (date) => {
    const today = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    const startDay = getStart(date, {weekStartsOn: 1});
    const endDay = getEnd(date, {weekStartsOn: 1});
    const weekNum = getWeek(date);
    let weekDates = [];

    for (let i = 0; i < 7; ++i) {
        weekDates.push(addDays(startDay, i));
    }

    return {datePassed: today, weekNum, startDay, endDay, weekDates};
}

console.log(getWeekDates(today));
console.log(getWeekDates(nextMon));
console.log(formatDistance(lastMon, today, { includeSeconds: true, addSuffix: true } ));