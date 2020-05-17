import axios from 'axios';
import UserService from '../../components/UserService';





const state = {
    userID: null,
}    
console.log(`vuex initialized, userID at ${state.userID}`);

const getters = {
    getUserID: (state) => {
        return state.userID;
    }
};

const actions = {
    
};

const mutations = {
    setUserID: (state, userID) => state.userID = userID,
};

// UserService.checkLogin(async (result) => {
//     state.userID = await result
// });
// console.log(`via API, userID now at ${state.userID}`);
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};