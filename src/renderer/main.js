import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRx from 'vue-rx';
import axios from 'axios';
import PortalVue from 'portal-vue'
import VueClipboard from 'vue-clipboard2'

import { Observable, BehaviorSubject } from "rxjs";

import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
import '@fortawesome/fontawesome-free/css/all.css';

import App from './App';
import router from './router';
import store from './store';
import db from './datastore'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$db = db;
Vue.config.productionTip = false;
Vue.use(VueClipboard)
Vue.use(PortalVue)
Vue.use(VueRx, {
  Observable,
  BehaviorSubject
})
Vue.use(Vuetify);
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
