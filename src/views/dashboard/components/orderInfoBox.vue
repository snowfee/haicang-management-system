<template>
  <div>
    <el-row :gutter="20" v-if="orderInfos && orderInfos.length > 0">
      <el-col :span="12" v-for="item in orderInfos" :key="item.id">
        <div class="info-box">
          <el-row :gutter="20" class="item-row">
            <el-col :span="12"><span class="item-title">{{item.member.userName}}</span></el-col>
            <el-col :span="12" class="align-right" v-if="orderStatus == 'PAID'">
              <el-button icon="el-icon-printer" circle style="font-size: 25px" @click="handleOrderPrint(item.id, item.deliveryAddress.receiverPhone)"></el-button>
            </el-col>
          </el-row>
          <el-row class="item-row" :gutter="20" v-for="order in item.orderItems" :key="order.id">
            <el-col :span="14">
              <el-row :gutter="5">
                <el-col :span="13"><span>{{order.product.name}}</span></el-col>
                <el-col :span="11"><span>{{order.product.specification}}</span></el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <span>{{order.count}}</span>
            </el-col>
            <el-col :span="5" class="align-right">
              <span>￥{{order.price}}</span>
            </el-col>
          </el-row>
          <el-row class="item-row">
            <el-col :span="24" class="align-right"><span>合计￥{{item.paidPrice}}</span></el-col>
          </el-row>
          <el-row :gutter="20" class="item-row">
            <el-col :span="19">
              收货地址：{{item.deliveryAddress.receiverAddress}}<br/>
              联系方式：{{item.deliveryAddress.receiverPhone}}
            </el-col>
            <el-col :span="5" class="align-right">
              <el-button type="primary" size="small" @click="orderOperate(item.id)">{{orderStatus == 'PAID' ? "开始配送" : "完成配送"}}</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>                
    </el-row>
    <el-row v-else class="no-data">
      <el-col :span="24" class="no-data-text">暂无数据</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props:{
    orderInfos: {
      required: true
    },
    orderStatus: {
      required: true
    }
  },
  methods: {
    orderOperate(id) {
      this.$emit('orderOperate', id)
    },
    handleOrderPrint(orderId, receiverPhone) {
      this.$emit('handleOrderPrint', orderId, receiverPhone)
    }
  }
}
</script>
<style lang="scss" scoped>
.align-right{
  text-align: right;
}
.align-center{
  text-align: center;
}
.info-box{
  padding: 15px 15px 5px 15px;
  border: 1px solid #d2d2d2;
  margin-bottom: 20px;
  .item-row{
    margin-bottom: 10px;
  }
  .item-title{
    font-size: 18px;
    font-weight: bold;
    line-height: 45px;
  }
}
.no-data{
  border: 1px solid #d2d2d2;
  height: 150px;
  .no-data-text{
    color: #909399;
    text-align: center;
    line-height: 150px;
  }
}
</style>


