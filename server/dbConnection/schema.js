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

});

module.exports.userSchema = userSchema;
module.exports.todoSchema = todoSchema;