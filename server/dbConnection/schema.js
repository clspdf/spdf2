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
});

const projectTodoSchema = new mongoose.Schema({
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'project'},
    title: {},
    content: {},
    
    created: {type: Date},
    due: {type: Date},
    status: {},
    nextStep: {type:Boolean}

});

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

module.exports.userSchema = userSchema;
module.exports.todoSchema = todoSchema;
module.exports.projectSchema = projectSchema;
module.exports.projectTodoSchema = projectTodoSchema;
module.exports.projectRemarkSchema = projectRemarkSchema;
module.exports.todoRemarkSchema = todoRemarkSchema;