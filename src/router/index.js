import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '@/components/page/LoginPage'
import test from '@/components/page/TestPage'
import RegisterList from '@/components/page/RegListPage'
import Register from '@/components/page/RegPage'
import MobileReg from '@/components/page/MobileRegPage'
import MobileScan from '@/components/page/MobileScanPage'
import MobileScanInfo from '@/components/page/MobileScanInfoPage'
import ContentEvent from '@/components/event/ContentEvent'
import CardPrintingPage from '@/components/page/CardPrinting'
import ManageEventPage from '@/components/page/ManageEventPage'
import ManageStaffPage from '@/components/page/ManageStaffPage'
import ReportPage from '@/components/page/ReportPage'
// import RegChartPage from '@/components/page/RegChartPage'
// import Chart from '@/components/reports/Chart'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/mobile-reg-home',
      name: 'mobile-reg-home',
      component: MobileReg
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/reg-list',
      name: 'reg-list',
      component: RegisterList
    },
    {
      path: '/reg',
      name: 'reg',
      component: Register
    },
    {
      path: '/mobile-scan',
      name: 'mobile-scan',
      component: MobileScan
    },
    {
      path: '/mobile-scan-info',
      name: 'mobile-scan-info',
      component: MobileScanInfo
    },

    {
      path: '/event',
      component: ContentEvent
    },
    // {
    //   path: '/*',
    //   name: '*',
    //   component: LoginPage
    // },
    {
      path: '/card-printing',
      name: 'card-printing',
      component: CardPrintingPage
    },
    {
      path: '/manage-event',
      name: 'manage-event',
      component: ManageEventPage
    },
    {
      path: '/manage-staff',
      name: 'manage-staff',
      component: ManageStaffPage
    },
    {
      path: '/report',
      name: 'report',
      component: ReportPage
    },
    {
      path: '*',
      name: '404',
      component: Register
    }
  ]
})
