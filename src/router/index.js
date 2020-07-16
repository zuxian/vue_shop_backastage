import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from  '../components/Login.vue'
// import Home  from  '../components/Home.vue'

const Home = () => import ('../components/Home.vue')


Vue.use(VueRouter)

const routes = [
  /* 重定向到   http://localhost:8080/#/login    */
  {path:'/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home',  component: Home}
]

const router = new VueRouter({
  routes
})


//  控制访问权限
router.beforeEach((to, from, next) => {
  //  to  将要访问的路径； from  代表从哪个路径跳转而来
  //  next 是个函数，表示放行   
  // next() 放行；    next('/login')  强制跳转

  //  如果用户访问的登录页，直接放行
  if(to.path === '/login')  return next()
  
  // 从sessionStorage 中获取到  保存的token 值
  const tokenStr = window.sessionStorage.getItem('token')

  // 没有 token， 强制跳转至登录页
  if(!tokenStr)  return next('/login')
  next()
})





export default router
