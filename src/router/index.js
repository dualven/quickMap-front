import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Upload from '@/components/Upload';
import ApiList from '@/components/ApiList';
import FileSearch from '@/components/FileSearch';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', 
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '',
          component: Upload
        },
        {
          path: '/index/upload',
          component: Upload
        },
        {
          path: '/index/apiList',
          component: ApiList
        },
        {
          path: '/index/search',
          component: FileSearch
        }
      ]
    }
  ],
  mode: 'history'
})
