import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

// Import components
import CourseList from './components/CourseList.vue';
import CourseDetail from './components/CourseDetail.vue';
import TeacherLogin from './components/TeacherLogin.vue';
import TeacherRegister from './components/TeacherRegister.vue';
import TeacherDashboard from './components/TeacherDashboard.vue';
import AdminLogin from './components/AdminLogin.vue';
import AdminDashboard from './components/AdminDashboard.vue';

// Auth guard function
const requireAuth = () => {
  const teacherId = localStorage.getItem('teacherId');
  if (!teacherId) {
    return '/teacher/login';
  }
  return true;
};

const requireAdmin = () => {
  const adminId = localStorage.getItem('adminId');
  if (!adminId) {
    return '/admin/login';
  }
  return true;
};

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'CourseList',
      component: CourseList
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: AdminDashboard,
      beforeEnter: requireAdmin
    },
    {
      path: '/course/:id',
      name: 'CourseDetail',
      component: CourseDetail,
      props: true
    },
    {
      path: '/teacher/login',
      name: 'TeacherLogin',
      component: TeacherLogin
    },
    {
      path: '/teacher/register',
      name: 'TeacherRegister',
      component: TeacherRegister
    },
    {
      path: '/teacher/dashboard',
      name: 'TeacherDashboard',
      component: TeacherDashboard,
      beforeEnter: requireAuth
    }
  ]
});

// Create and mount app
const app = createApp(App);
app.use(router);
app.mount('#app');
