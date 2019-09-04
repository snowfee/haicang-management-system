<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
    <audio src="" id="orderNotice"></audio>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import orderNoticeAudio from '@/assets/orderNotice.mp3'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.websocketclose()
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    playNoticeAudio() {
      let buttonAudio = document.getElementById('orderNotice')
      buttonAudio.setAttribute('src', orderNoticeAudio)
      buttonAudio.play()
    },
    initWebSocket() {
      this.websock = new WebSocket(this.WEBSOCKETSERVE)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function () {
      console.log("WebSocket连接成功")
    },
    websocketonerror: function (e) {
      console.log("WebSocket连接发生错误")
    },
    websocketonmessage(e) {
      let data = JSON.parse(e.data)
      console.log(data)
      if (data.notifyType == 'NEW_ORDER') {
        this.playNoticeAudio()
        this.$confirm('有新的订单，是否查看', '提示', {
          confirmButtonText: '查看',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$router.push({
            path: '/home'
          })
        })
      } 
    },
    websocketclose: function (e) {
      console.log("connection closed")
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
