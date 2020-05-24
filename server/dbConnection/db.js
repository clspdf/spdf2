const mongoose = require('mongoose');
const MY_CONFIG = require('../../my_config');
const {userSchema, todoSchema, projectSchema, projectTodoSchema} = require('./schema');

user_db = mongoose.createConnection(MY_CONFIG.MONGO_SESSION_STRING, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('User/session db activated~');
    }
});

data_db = mongoose.createConnection(MY_CONFIG.MONGO_DATA_STRING, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Data db activated~');
    }
});

user_model = user_db.model('user', userSchema);
todo_model = data_db.model('todo', todoSchema);
project_model = data_db.model('project', projectSchema);
projectTodo_model = data_db.model('projectTodo', projectTodoSchema);
// projectRemark_model = data_db.model('projectRemark', projectRemarkSchema);
// todoRemark_model = data_db.model('todoRemark', todoRemarkSchema);

module.exports.user_db = user_db;
module.exports.data_db = data_db;
module.exports.user_model = user_model;
module.exports.todo_model = todo_model;

module.exports.project_model = project_model;
// module.exports.projectRemark_model = projectRemark_model;
module.exports.projectTodo_model = projectTodo_model;
// module.exports.todoRemark_model = todoRemark_model;
