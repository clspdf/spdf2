const express = require('express');
const {week_model} = require('../dbConnection/db');
const {startOfWeek, endOfWeek, eachDayOfInterval, parseISO, startOfDay, getISODay, format} = require('date-fns');
const {utcToZonedTime} = require('date-fns-tz');

const router = express.Router();

const defaultTimeZone = 'Asia/Shanghai';

router.post('/', async (req, res) => { // date (ISO string) to be in parsed date object
    if(req.session.userID){
        console.log(`received date in ISOstring: ${parseISO(req.body.selectedDateISOString)}`);

        const zonedSelectedDate = startOfDay(utcToZonedTime(req.body.selectedDateISOString, defaultTimeZone));
        console.log(`zoned date: ${zonedSelectedDate}`);
        const startDate = startOfWeek(zonedSelectedDate, {weekStartsOn: 1});
        const endDate = endOfWeek(zonedSelectedDate, {weekStartsOn: 1});
        console.log(`start date: ${startDate}, end date: ${endDate}`);
        const weekDates = eachDayOfInterval({start: startDate, end: endDate});
        console.log(`week dates: ${weekDates}`);
        const weekWorkSchedule = req.body.weekWorkSchedule;
        const weekGrowthSchedule = req.body.weekGrowthSchedule;
        const weekLifeSchedule = req.body.weekLifeSchedule;
        const weekComment = req.body.weekComment;
        const dailySchedule = req.body.dailySchedule;
        // console.log(weekDates.reduce((acc, weekDate) => {
        //                     return {...acc, [weekDate.toISOString()]: []};
        //                 }));
        // console.log(weekDates);
        // console.log(workArray);
        // console.log(growthArray);
        // console.log(lifeArray);
        // console.log(weekComment);
        try {
            const existedDoc = await week_model.findOne({weekDates: parseISO(startDate.toISOString())});
            // res.send(existedDoc);
            if (existedDoc) {  // update exisitng doc
                existedDoc.weekWorkSchedule = weekWorkSchedule;
                existedDoc.weekGrowthSchedule = weekGrowthSchedule;
                existedDoc.weekLifeSchedule = weekLifeSchedule;
                existedDoc.weekComment = weekComment;
                existedDoc.weekDates = weekDates;
                existedDoc.dailySchedule = dailySchedule;
                await existedDoc.save();
                res.send(existedDoc);
            } else { // create new doc
                // const dailySchedule = weekDates.reduce((acc, weekDate) => {
                //     return {...acc, [getISODay(weekDate)]: []};
                // }, {});
                const createdDoc = new week_model({
                    weekDates,
                    weekWorkSchedule,
                    weekGrowthSchedule,
                    weekLifeSchedule,
                    weekComment,
                    dailySchedule: weekDates.reduce((acc, weekDate) => {
                        return {...acc, [format(weekDate, 'yyMMddE')]: {
                            date: weekDate,
                            dailyWorkArray: {},
                            dailyGrowthArray: {},
                            dailyLifeArray: {},
                            dailyComment: ''
                        }};
                    }, {})
                });
                await createdDoc.save();
                res.send(createdDoc);
            }
        } catch (error) {
            console.log(error);
            res.send(null);
        }
        
    } else {
        res.send(null);
    }
});

router.get('/', async (req, res) => {
    if (req.session.userID){
        console.log(`received instruction to get doc by dateISO: ${req.query.selectedDateISOString}`);
        
        const selectedDate = startOfDay(parseISO(req.query.selectedDateISOString));
        console.log(`date criteria as ${selectedDate}`);
        try {
            const doc = await week_model.findOne({weekDates: selectedDate});
            console.log(`doc to be returned: ${doc}`);
            res.send(doc);
        } catch (error) {
            console.log(error);
            res.send(null);
        }
        
        // res.send(`querying date at ${selectedDate}`);
    } else {
        res.send(null);
    }
});


module.exports = router;