import 'babel-polyfill'// ES6转换
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

// 引入全局样式
import './common/stylus/index.styl'
// 解决300ms延迟
fastclick.attach(document.body)

// 图片懒加载
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
})
