<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="营收合计" name="revenue">
        <finance-revenue></finance-revenue>
      </el-tab-pane>
      <el-tab-pane label="优惠报表" name="coupon">
        <finance-coupon></finance-coupon>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import financeRevenue from './financeItem/revenue'
import financeCoupon from './financeItem/coupon'
export default {
  data() {
    return {
      activeName: 'revenue'
    }
  },
  components: {
    financeRevenue,
    financeCoupon
  }
}
</script>
