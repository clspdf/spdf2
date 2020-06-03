import axios from 'axios';

const project_url = '/api/projects/';
const projectTodo_url = '/api/projecttodos/';

class ProjectService {
    
    // get option

    static getProjects() {
        return axios.get(project_url);
    }

    static getOneProject(projectID) {
        return axios.get(project_url + projectID);
    }

    static getProjectTodos(projectID) {
        return axios.get(projectTodo_url + projectID);
    }

    static getAllProjectTodos() {
        return axios.get(projectTodo_url);
    }

    static createProject(project) {
        return axios.post(project_url, {
            projectCategory: project.projectCategory,
            title: project.title,
            content: project.content,
            
            due: project.due,
            status: project.status
        });
    }

    static updateProject(project) {
        return axios.post(project_url + '/' + project_id, {
            projectCategory: project.projectCategory,
            title: project.title,
            content: project.content,
            
            due: project.due,
            status: project.status
        });
    }

    static reorderProjectTodos(projectID, oldIndex, newIndex, projectTodo_id) {
        return axios.post(projectTodo_url + '/reorder/' + projectID, {
            oldIndex,
            newIndex,
            projectTodo_id
        });
    }

    static deleteProjectTodo(projectTodo) {
        console.log(projectTodo.order);
        return axios.delete(projectTodo_url + '/' + projectTodo._id, {data: {
            project_id: projectTodo.project_id ? projectTodo.project_id : null,
            order: projectTodo.order ? Number(projectTodo.order): null
        }});
    }

    static createProjectTodo(projectTodo) {
        return axios.post(projectTodo_url, {
            project_id: projectTodo.project_id,
            title: projectTodo.title,
            content: projectTodo.content,
            // order: req.body.order, to create on the fly
            
            due: projectTodo.due,
            status: projectTodo.status,
            
        });
    }

    static updateProjectTodo(projectTodo) {
        return axios.post(projectTodo_url + '/' + projectTodo._id, {
            project_id: projectTodo.project_id,
            title: projectTodo.title,
            content: projectTodo.content,
            order: Number(projectTodo.order),
            
            due: new Date(projectTodo.due),
            status: projectTodo.status,
            
        });
    }

    static switchTodoProject(projectTodo, old_project_id) {
        return axios.post(projectTodo_url + 'switchproject/' + old_project_id, {
            _id: projectTodo._id,
            project_id: projectTodo.project_id,
            title: projectTodo.title,
            content: projectTodo.content,
            order: Number(projectTodo.order),
            
            due: new Date(projectTodo.due),
            status: projectTodo.status,
        });
    }

    static updateProject(project) {
        return axios.post(project_url + '/' + project._id, {
            projectCategory: project.projectCategory,
            title: project.title,
            content: project.content,
            
            due: new Date(project.due),
            status: project.status
        })
    }

    static deleteProject(project) {
        return axios.delete(project_url + '/' + project._id);
    }
};


export default ProjectService;
