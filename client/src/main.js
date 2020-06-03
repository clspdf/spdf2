import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
// import draggable from 'vuedraggable';
// import VueSession from 'vue-session';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  // draggable,
  // VueSession,
  render: h => h(App)
}).$mount('#app')
