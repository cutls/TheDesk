import Vue from 'vue'
import About from './About.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(About),
}).$mount('#app')
