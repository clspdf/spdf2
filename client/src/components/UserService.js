import axios from 'axios';
import path from 'path';

const user_url = 'api/user';

class UserService {
    
    static login(user) {
        // console.log(path.join(user_url, 'login'));
        return axios.post(user_url + '/login', user);
    };

    static checkLogin() {
        return axios.get(user_url + '/checkuser');
    };

    static logout() {
        return axios.post(user_url + '/logout');
    };

};

export default UserService;