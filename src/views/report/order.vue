<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="时段汇总" name="interval">
        <order-interval></order-interval>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import orderInterval from './orderItem/interval'

export default {
  data() {
    return {
      activeName: 'interval'
    }
  },
  components: {
    orderInterval
  }
}
</script>
