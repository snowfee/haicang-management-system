<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      router: []
    }
  },
  created() {
    this.router = this.$router.options.routes
    this.filterRouter(this.router)
  },
  methods: {
    filterRouter(routes) {
      routes.forEach((item, index) => {
        if (!item.hidden && item.id && this.permission.indexOf(item.id) < 0) {
          // console.log('ok', item)
          item.hidden = true
        }
        if (item.children && item.children.length > 0) {
          this.filterRouter(item.children)
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission'
    ]),
    routes() {
      return this.router
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
