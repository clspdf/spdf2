const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
        
    },

    password: {
        type: String,
        required: true,
        
    }

});

const todoSchema = new mongoose.Schema({
    title: {
        
    },

    content: {
         
    },
    status: {
        
    },
    due: {
        
    },
    created:{
        
    }

});

const projectSchema = new mongoose.Schema({
    projectCategory:{},
    title: {},
    content: {},
    created: {type: Date},
    due: {type: Date},
    status: {},
    // projectTodo: {type: mongoose.Schema.Types.ObjectId, ref:'projectTodo'}
    // remark: [{type: mongoose.Schema.Types.ObjectId, ref: 'remark'}]
}, {minimize: false});

const projectTodoSchema = new mongoose.Schema({
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'project'},
    title: {},
    content: {},
    order: {},
    created: {type: Date},
    due: {type: Date},
    status: {},
    nextStep: {type:Boolean}

}, {minimize: false});

const projectRemarkSchema = new mongoose.Schema({
    
    content: {},
    belong_id: {type: mongoose.Schema.Types.ObjectId, ref: 'project'},
    created: {type: Date},
    finalized_flag: {type: Boolean}

});

const todoRemarkSchema = new mongoose.Schema({
    
    content: {},
    belong_id: {type: mongoose.Schema.Types.ObjectId, ref: 'projectTodo'},
    created: {type: Date},
    finalized_flag: {type: Boolean}

});


const weekSchema = new mongoose.Schema({
    weekDates: [Date],
    weekWorkSchedule: {},
    weekGrowthSchedule: {},
    weekLifeSchedule: {},
    dailySchedule: {},
    weekComment: '',
    
}, {minimize: false});

const daySchema = new mongoose.Schema({
    date: {type: Date},
    workTodos:[],
    growthTodos:[],
    lifeTodos:[]
});


module.exports.userSchema = userSchema;
module.exports.todoSchema = todoSchema;
module.exports.projectSchema = projectSchema;
module.exports.projectTodoSchema = projectTodoSchema;
module.exports.projectRemarkSchema = projectRemarkSchema;
module.exports.todoRemarkSchema = todoRemarkSchema;
module.exports.weekSchema = weekSchema;
module.exports.daySchema = daySchema;
