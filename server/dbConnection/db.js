const mongoose = require('mongoose');
const MY_CONFIG = require('../../my_config');
const {userSchema, todoSchema} = require('./schema');

user_db = mongoose.createConnection(MY_CONFIG.MONGO_SESSION_STRING, {useNewUrlParser:true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('User/session db activated~');
    }
});

data_db = mongoose.createConnection(MY_CONFIG.MONGO_DATA_STRING, {useNewUrlParser:true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data db activated~');
    }
});

user_model = user_db.model('user', userSchema);
todo_model = data_db.model('todo', todoSchema);

module.exports.user_db = user_db;
module.exports.data_db = data_db;
module.exports.user_model = user_model;
module.exports.todo_model = todo_model;
