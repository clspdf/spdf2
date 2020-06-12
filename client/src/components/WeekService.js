import axios from 'axios';

const week_url = '/api/weeks/';

class WeekService {
    static getWeekByDate(selectedDateISOString) {
        console.log(selectedDateISOString);
        return axios.get(week_url, {params:{
            selectedDateISOString
        }});
    }

    static postWeekByDate(selectedDateISOString, currentWeekSchedule) {
        // console.log({...week, selectedDateISOString});
        return axios.post(week_url, {
            selectedDateISOString,
            ...currentWeekSchedule
        })
    }
};


export default WeekService;