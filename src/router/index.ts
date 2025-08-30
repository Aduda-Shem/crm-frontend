import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Leads = () => import('../views/Leads.vue')
const LeadDetail = () => import('../views/LeadDetail.vue')
const Contacts = () => import('../views/Contacts.vue')
const Notes = () => import('../views/Notes.vue')
const Reminders = () => import('../views/Reminders.vue')
const Correspondence = () => import('../views/Correspondence.vue')
const Audit = () => import('../views/Audit.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: Login, meta: { public: true, title: 'Login' } },
    { path: '/register', name: 'Register', component: Register, meta: { public: true, title: 'Register' } },
    { path: '/', name: 'Dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
    { path: '/leads', name: 'Leads', component: Leads, meta: { title: 'Leads' } },
    { path: '/leads/:id', name: 'LeadDetail', component: LeadDetail, meta: { title: 'Lead Detail' } },
    { path: '/contacts', name: 'Contacts', component: Contacts, meta: { title: 'Contacts' } },
    { path: '/reminders', name: 'Reminders', component: Reminders, meta: { title: 'Reminders' } },
    { path: '/correspondence', name: 'Correspondence', component: Correspondence, meta: { title: 'Correspondence' } },
    { path: '/audit', name: 'Audit', component: Audit, meta: { requiresManager: true, title: 'Audit Trail' } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return '/login'
  if (to.meta.requiresManager && auth.role !== 'MANAGER') return '/'
})

export default router
