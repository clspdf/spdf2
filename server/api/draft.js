// const now = new Date();

// console.log(`The default datetime: ${now}`);

// const formatter = new Intl.DateTimeFormat('en-US', {
//     weekday: 'short',
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric'

// });

// const formatted_date = formatter.format(now);

// console.log(`The formatted datetime: ${formatted_date}`);

// const part_date = formatter.formatToParts(now);

// console.log(`The parted datetime: ${part_date[0].type}`);

// const [{ value: month },,{ value: day },,{ value: year }] = formatter.formatToParts(now);

// console.log(`not sure if work: ${month}/${day}/${year}`);

// const format_array = ['year', 'month', 'day', 'hour', 'minute'];

// const date_object = formatter.formatToParts(now).reduce((acc, ele) => {
//     if (format_array.includes(ele.type)) {
//         console.log(ele);
//         const {type, value} = ele;
//         // accele.type = ele.value;
//         console.log(`adding new type of ${type} and value of ${value}`);
//         console.log({...acc});
//         return {...acc, [type]: value};
//     } else {
//         console.log(`element ${ele} is not for adding to acc...`);
//         return {...acc};
//     }
// }, {});

// console.log(date_object);

// console.log(now.toLocaleString("en-US", {timeZone: 'Asia/Shanghai'}));
// console.log(now.toLocaleString("en-US", {timeZone: 'America/Adak'}));



// const d1 = new Date(1489199400000);
// console.log(d1);
// console.log(d1.toString());
// console.log(d1.getTime());
// console.log(d1.getTimezoneOffset()); // offset in minute

// const now = new Date();
// console.log(`Current datetime: ${now}`);
// console.log(now.getUTCDay());


// 尝试使用date-fns

const {startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, parse, getISODay, getDay, startOfDay} = require('date-fns');
const {utcToZonedTime, zonedTimeToUtc} = require('date-fns-tz');
const cnNow = new Date();

// console.log(`current date is ${now}`);
// console.log(`date after formatting: ${format(now, 'MMM/do/yyyy')}`);
// console.log(`to ISOString: ${now.toISOString()}`);
// console.log(`parsedISO: ${(parseISO(now.toISOString()))}`);
// // console.log(`first day of the week is ${startOfWeek(now)}`);
// // console.log(`last day of the week is ${endOfWeek(now)}`);

// // console.log(`all days of the week is ${eachDayOfInterval({start: startOfWeek(now), end: endOfWeek(now)})}`);
// console.log(`parsing 2020-06-20 as ${parse("2020-06-20", "yyyy-MM-dd", new Date())}`);

// const a = [];
// console.log(`a is ${a}`);
// if (a) {
//     console.log('a is considered true');
// } else {
//     console.log('a is considered false')
// }



// const ob = {a: 1, b: 2};
// const b = {c: 4, ob};
// const c = {...ob, c:4};
// console.log(b);
// console.log(c);

// console.log(parseISO('2020-06-08T16:00:00.000Z'));
// console.log([].length)

// const start = startOfWeek(now);
// const end = endOfWeek(now);
// const weekDates = eachDayOfInterval({start: start, end: end});
// console.log(weekDates);
// const weekDatesString = weekDates.map(weekDate => weekDate.toISOString());
// console.log(weekDatesString);
// const formattedWeekDates = weekDatesString.map(weekDateString => {
//     return {string: weekDateString, text: format(parseISO(weekDateString), "yyMMddE"), checked: false};
// })
// console.log(formattedWeekDates);

// const weekdays = [
//     '2020-06-06T16:00:00.000Z',
//     '2020-06-07T16:00:00.000Z',
//     '2020-06-08T16:00:00.000Z',
//     '2020-06-09T16:00:00.000Z',
//     '2020-06-10T16:00:00.000Z',
//     '2020-06-11T16:00:00.000Z',
//     '2020-06-12T16:00:00.000Z'];
// // console.log(getDay(parseISO(weekdays[0])));
// // console.log(getISODay(parseISO(weekdays[0])));

// // console

// const my = weekdays.reduce((acc1, weekday) => {
//     console.log(`${weekday}: ${getISODay(parseISO(weekday))}, ${parseISO(weekday)}`);
//     return {...acc1, [getISODay(parseISO(weekday))]: {}};
// }, {});

// console.log(my);


// const deepObject = {a: 123, b: [1,2,3]};
// console.log(`original deep object: ${JSON.stringify(deepObject)}`);
// const deepCopy = JSON.parse(JSON.stringify(deepObject));
// deepCopy.b = [4,5,6];
// console.log(`updated deep copy object: ${JSON.stringify(deepCopy)}`);
// console.log(`original deep object after deep copy update: ${JSON.stringify(deepObject)}`);

// console.log({...deepObject});

// const obj = {1: 'a', 3: 'commit'};
// // console.log(obj.map())
// const empty = {a: []};
// console.log(empty.a.length);

// const b1 = 1;
// console.log(obj[b1]);

// console.log(Object.keys({a: 1}));
// console.log('abc'.slice(1-3));
// console.log(Object.entries(deepObject));
// const count = new Array(5);
// const mapCount = count.map((item, index) => index + 1);
// console.log(mapCount);
const tz = 'Asia/Shanghai';
console.log(`China now: ${cnNow}`);

console.log(`China now in UTC String: ${cnNow.toISOString()}`);
console.log(`China now from UTC Time: ${utcToZonedTime(cnNow.toISOString(), tz)}`);
console.log(`In UTC String again: ${utcToZonedTime(cnNow.toISOString(), tz).toISOString()}`);

console.log(`local offset to UTC time: ${cnNow.getTimezoneOffset()}`);
console.log(480/60);
console.log(startOfDay(cnNow));
console.log(startOfDay(cnNow).toISOString());