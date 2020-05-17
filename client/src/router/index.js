import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login';
import store from '../store/index.js';
import UserService from '../components/UserService';
import Todos from '../views/Todos.vue';

Vue.use(VueRouter)

  const routes = [
  
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
  {
    path: '/todos',
    name: 'Todos',
    component: Todos
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) =>{
  const userID = store.getters['users/getUserID'];
  console.log(to.name);
  console.log(`User ID extracted from vuex: ${userID}`);
  if (!userID) {
    console.log(`UserID not in vuex, checking server record....`);
    const userID = (await UserService.checkLogin()).data;
    console.log(`User ID extracted from server record: ${userID}`);
    if (userID) {
      console.log('user ID found on sever side, now updating vuex status...')
      store.commit('users/setUserID', userID);
      console.log(`Now vuex has the userID of: ${store.getters['users/getUserID']}`);
    } else {
      console.log('nil session record from sever side either!')
    }
    
  }
  if (to.name !== 'Login' && !store.getters['users/getUserID']) {
    console.log(`No userID in both server and vuex`);
    next('/login');
  } else {
    
    next();
  }
  
})

export default router
