const express = require('express');
const {week_model} = require('../dbConnection/db');
const {startOfWeek, endOfWeek, eachDayOfInterval, parseISO, startOfDay, getISODay, format, addHours} = require('date-fns');
const {utcToZonedTime} = require('date-fns-tz');

const router = express.Router();

const CNHourOffset = -8; //Dc 
const ServerHourOffset = new Date().getTimezoneOffset() / 60; // Ds
const hourShift = ServerHourOffset - CNHourOffset;

router.post('/', async (req, res) => { // date (ISO string) to be in parsed date object
    if(req.session.userID){
        console.log(`received date in ISOstring: ${req.body.selectedDateISOString}`);
        const weekWorkSchedule = req.body.weekWorkSchedule;
        const weekGrowthSchedule = req.body.weekGrowthSchedule;
        const weekLifeSchedule = req.body.weekLifeSchedule;
        const weekComment = req.body.weekComment;
        const dailySchedule = req.body.dailySchedule;
        
        try {
            const shiftedDateStart = startOfDay(addHours(parseISO(req.body.selectedDateISOString), hourShift));
            const serverDateStart = addHours(shiftedDateStart, -hourShift);
            const existedDoc = await week_model.findOne({weekDates: serverDateStart});
            // res.send(existedDoc);
            if (existedDoc) {  // update exisitng doc
                console.log(`found existing doc`);
                existedDoc.weekWorkSchedule = weekWorkSchedule;
                existedDoc.weekGrowthSchedule = weekGrowthSchedule;
                existedDoc.weekLifeSchedule = weekLifeSchedule;
                existedDoc.weekComment = weekComment;
                // existedDoc.weekDates = weekDates; // weekdate never changes after creation
                existedDoc.dailySchedule = dailySchedule;
                await existedDoc.save();
                res.send(existedDoc);
            } else { // create new doc
                console.log('To create new doc');
                // as fns function works based on server's local time, need to 
                // 1) shift server time by (server offset - client offset) to same as client time; (client datetime in UCT -> UCT in server datetime -> server datetime =shift> server datetime same as client datetime)
                // 2) perform fns function on shifted time, including formatting
                // 3) shift back by same amount to derive correct server time (for Mongo to cast to UCT time)

                // 1) shift server time

                // console.log(`CN offset (in hours): ${CNHourOffset}`);
                // console.log(`Server offset (in hour) is: ${ServerHourOffset}`);
                const shiftedTime = addHours(parseISO(req.body.selectedDateISOString), hourShift);
                // console.log(`shiftedTime: ${shiftedTime}`);

                // 2) perform required functions

                const shiftedStartDate = startOfWeek(shiftedTime, {weekStartsOn: 1});
                const shiftedEndDate = endOfWeek(shiftedTime, {weekStartsOn: 1});
                const shiftedWeekDates = eachDayOfInterval({start: shiftedStartDate, end: shiftedEndDate});
                const shiftedWeekdays = shiftedWeekDates.map(shiftedWeekDate => format(shiftedWeekDate, 'yyMMddE'));
                
                // 3) shift back to derive correct server date (so that Mongo can cast corret UCT time)
                
                const serverDates = shiftedWeekDates.map(shiftedWeekDate => addHours(shiftedWeekDate, -hourShift));
                console.log(serverDates);
                // other value for weekSchedule
                
                const createdDoc = new week_model({
                    weekDates: serverDates, // server dates would be cast to UTC time by Mongo
                    weekWorkSchedule,
                    weekGrowthSchedule,
                    weekLifeSchedule,
                    weekComment,
                    dailySchedule: shiftedWeekdays.reduce((acc, shiftedWeekday, index) => {
                        return {...acc, [shiftedWeekday]: {
                            date: serverDates[index],
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
        console.log(`received instruction to get doc by UTC: ${parseISO(req.query.selectedDateISOString).toISOString()}`);
        const shiftedDateStart = startOfDay(addHours(parseISO(req.query.selectedDateISOString), hourShift));
        const serverDateStart = addHours(shiftedDateStart, -hourShift);
        console.log(`date criteria in server date as ${serverDateStart}`);
        try {
            const doc = await week_model.findOne({weekDates: serverDateStart});
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