<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="退单报表" name="return">
        <order-return></order-return>
      </el-tab-pane> -->
      <el-tab-pane label="时段汇总" name="interval">
        <order-interval></order-interval>
      </el-tab-pane>
      <!-- <el-tab-pane label="区域营收" name="region">
        <order-region></order-region>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
// import orderReturn from './orderItem/return'
import orderInterval from './orderItem/interval'
// import orderRegion from './orderItem/region'
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
