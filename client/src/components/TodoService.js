import axios from 'axios';

const todo_url = 'api/todos';


class TodoService {
    
    // fetch all todos
    static getTodos() {
        // console.log(path.join(user_url, 'login'));
        return axios.get(todo_url + '/');
    };

    // create todo
    static createTodo(todo) {
        return axios.post(todo_url + '/', {
            title: todo.title,
            content: todo.content,
            status: todo.status,
            created: todo.created,
            due: todo.due
        });
    }
    
    
    // edit todo
    static updateTodo(todo, id) {
        // console.log(todo);
        return axios.post(todo_url + '/' + id, {
            title: todo.title,
            content: todo.content,
            status: todo.status,
            created: todo.created,
            due: todo.due
        });
    }
    // delete todo
    static deleteTodo(id) {
        return axios.delete(todo_url + '/' + id);
    }

};

export default TodoService;