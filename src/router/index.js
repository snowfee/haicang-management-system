import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    id: 1,
    children: [{
      path: 'home',
      name: '首页',
      id: 1,
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/list',
    name: '员工管理',
    id: 2,
    meta: { title: '员工管理', icon: 'user' },
    children: [{
      path: 'list',
      name: '员工列表',
      id: 3,
      component: () => import('@/views/staff/list'),
      meta: { title: '员工列表', icon: 'list' }
    }, {
      path: 'addStaff',
      name: '添加员工',
      component: () => import('@/views/staff/addStaff'),
      meta: { title: '添加员工', icon: 'add' },
      hidden: false
    }, {
      path: 'editStaff',
      name: '编辑员工',
      component: () => import('@/views/staff/editStaff'),
      meta: { title: '编辑员工', icon: 'add' },
      hidden: true
    }, {
      path: 'role',
      name: '职位列表',
      id: 4,
      component: () => import('@/views/staff/role'),
      meta: { title: '职位列表', icon: 'list' }
    }, {
      path: 'addRole',
      name: '添加职位',
      component: () => import('@/views/staff/addRole'),
      meta: { title: '添加职位', icon: 'add' },
      hidden: false
    }, {
      path: 'editRole',
      name: '编辑职位',
      component: () => import('@/views/staff/editRole'),
      meta: { title: '编辑职位', icon: 'add' },
      hidden: true
    }]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: '商品管理',
    id: 6,
    meta: { title: '商品管理', icon: 'goods' },
    children: [{
      path: 'category',
      name: '类目管理',
      id: 7,
      component: () => import('@/views/product/category'),
      meta: { title: '类目管理', icon: 'list' }
    }, {
      path: 'list',
      name: '商品列表',
      id: 8,
      component: () => import('@/views/product/list'),
      meta: { title: '商品列表', icon: 'list' }
    }, {
      path: 'coupon',
      name: '活动管理',
      id: 9,
      component: () => import('@/views/product/coupon'),
      meta: { title: '活动管理', icon: 'list' }
    }, {
      path: 'addCoupon',
      name: '添加活动',
      component: () => import('@/views/product/editCoupon'),
      meta: { title: '添加活动', icon: 'list' },
      hidden: true
    }, {
      path: 'updateCoupon',
      name: '更新活动',
      component: () => import('@/views/product/editCoupon'),
      meta: { title: '更新活动', icon: 'list' },
      hidden: true
    }, {
      path: 'add',
      name: '添加商品',
      id: 40,
      component: () => import('@/views/product/add'),
      meta: { title: '添加商品', icon: 'add' }
    }, {
      path: 'update',
      name: '修改商品',
      component: () => import('@/views/product/update'),
      meta: { title: '添加商品', icon: 'add' },
      hidden: true
    }, {
      path: 'see',
      name: '查看商品',
      component: () => import('@/views/product/see'),
      meta: { title: '查看商品', icon: 'add' },
      hidden: true
    }]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/list',
    name: '物料管理',
    id: 35,
    meta: { title: '物料管理', icon: 'goods' },
    children: [{
      path: 'unit',
      name: '单位管理',
      id: 36,
      component: () => import('@/views/materials/unit'),
      meta: { title: '单位管理', icon: 'list' }
    }, {
      path: 'attribute',
      name: '属性管理',
      id: 37,
      component: () => import('@/views/materials/attribute/index'),
      meta: { title: '属性管理', icon: 'list' }
    }, {
      path: 'attributeList',
      name: '属性列表',
      component: () => import('@/views/materials/attribute/list'),
      meta: { title: '属性列表', icon: 'list' },
      hidden: true
    }, {
      path: 'addAttribute/:attrId',
      name: '添加属性',
      component: () => import('@/views/materials/attribute/add'),
      meta: { title: '添加属性', icon: 'add' },
      hidden: true
    }, {
      path: 'editAttribute/:attrId',
      name: '编辑属性',
      component: () => import('@/views/materials/attribute/edit'),
      meta: { title: '编辑属性', icon: 'add' },
      hidden: true
    }, {
      path: 'add',
      name: '添加物料',
      id: 38,
      component: () => import('@/views/materials/add'),
      meta: { title: '添加物料', icon: 'add' }
    }, {
      path: 'edit',
      name: '编辑物料',
      component: () => import('@/views/materials/edit'),
      meta: { title: '编辑物料', icon: 'add' },
      hidden: true
    }, {
      path: 'list',
      name: '物料列表',
      id: 39,
      component: () => import('@/views/materials/list'),
      meta: { title: '物料列表', icon: 'list' }
    }]
  },

  {
    path: '/member',
    component: Layout,
    redirect: '/member/list',
    name: '会员管理',
    id: 10,
    meta: { title: '会员管理', icon: 'goods' },
    children: [{
      path: 'list',
      name: '会员列表',
      id: 11,
      component: () => import('@/views/member/list'),
      meta: { title: '会员列表', icon: 'list' }
    }, {
      path: 'addMember',
      name: '添加会员',
      component: () => import('@/views/member/editMember'),
      meta: { title: '添加会员', icon: 'list' },
      hidden: true
    }, {
      path: 'updateMember',
      name: '更新会员',
      component: () => import('@/views/member/editMember'),
      meta: { title: '更新会员', icon: 'list' },
      hidden: true
    }, {
      path: 'membershipGrade',
      name: '会员等级',
      id: 45,
      component: () => import('@/views/member/membershipGrade'),
      meta: { title: '会员等级', icon: 'list' }
    }, {
      path: 'feedback',
      name: '意见反馈',
      id: 34,
      component: () => import('@/views/member/feedback'),
      meta: { title: '意见反馈', icon: 'list' }
    }]
  },

  {
    path: '/appset',
    component: Layout,
    redirect: '/appset/homePage',
    name: 'App设置',
    id: 41,
    meta: { title: 'App设置', icon: 'goods' },
    children: [{
      path: 'homePage',
      name: '首页管理',
      id: 42,
      component: () => import('@/views/appset/homePage'),
      meta: { title: 'app首页管理', icon: 'list' }
    }, {
      path: 'addHomeBlock',
      name: '添加版块',
      component: () => import('@/views/appset/editHomeBlock'),
      meta: { title: '添加版块', icon: 'list' },
      hidden: true
    }, {
      path: 'updateHomeBlock',
      name: '编辑版块',
      component: () => import('@/views/appset/editHomeBlock'),
      meta: { title: '编辑版块', icon: 'list' },
      hidden: true
    }, {
      path: 'carousel',
      name: '首页轮播图设置',
      id: 43,
      component: () => import('@/views/appset/carousel'),
      meta: { title: 'app首页轮播图设置', icon: 'list' }
    }, {
      path: 'addJump',
      name: '添加跳转',
      component: () => import('@/views/appset/editBannerJump'),
      meta: { title: '添加跳转', icon: 'list' },
      hidden: true
    }, {
      path: 'editJump',
      name: '编辑跳转',
      component: () => import('@/views/appset/editBannerJump'),
      meta: { title: '编辑跳转', icon: 'list' },
      hidden: true
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/messageCenter',
    name: '系统设置',
    id: 23,
    meta: { title: '系统设置', icon: 'system' },
    children: [{
      path: 'settings',
      name: '参数设置',
      id: 24,
      component: () => import('@/views/system/settings'),
      meta: { title: '参数设置', icon: 'list' }
    }, {
      path: 'addparam',
      name: '添加参数',
      component: () => import('@/views/system/editParam'),
      meta: { title: '添加参数', icon: 'list' },
      hidden: true
    }, {
      path: 'updateparam',
      name: '更新参数',
      component: () => import('@/views/system/editParam'),
      meta: { title: '更新参数', icon: 'list' },
      hidden: true
    }, {
      path: 'messageCenter',
      name: '消息中心',
      id: 44,
      component: () => import('@/views/system/messageCenter'),
      meta: { title: '消息中心', icon: 'list' }
    }, {
      path: 'addmessage',
      name: '添加消息',
      component: () => import('@/views/system/editMessage'),
      meta: { title: '添加消息', icon: 'list' },
      hidden: true
    }, {
      path: 'updatemessage',
      name: '更新消息',
      component: () => import('@/views/system/editMessage'),
      meta: { title: '更新消息', icon: 'list' },
      hidden: true
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
