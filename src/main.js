// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI  from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
//animate.css
import animated from 'vue2-animate/dist/vue2-animate.min.css' 

Vue.use(animated);
Vue.config.productionTip = false
//ElementUI
Vue.use(ElementUI);

//VueClipboard
VueClipboard.config.autoSetContainer = true 
Vue.use(VueClipboard)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
