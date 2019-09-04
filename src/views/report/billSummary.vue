<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="handelSearch()">查询</el-button>
          <el-button type="primary" @click="handelExcel()">下载报表</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="交易时间">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>  
      </div>
    </div>
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="box-content">
          <div class="amout-price">
            <span>合计</span>
            <span>订单数：{{count}}</span>
            <span>订单金额：{{orderPriceAmout}}</span>
            <span>实收金额：{{actualPriceAmout}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-table border :data="tableData" style="width: 100%;">
      <template slot="empty">
        <div>
          {{ emptyText }}
        </div>
      </template>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="orderCount" label="订单总数"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
      <el-table-column prop="receivablePrice" label="应收金额"></el-table-column>
      <el-table-column prop="actualPrice" label="实收金额"></el-table-column>
      <el-table-column prop="diffPrice" label="差额"></el-table-column>
      <el-table-column prop="couponPrice" label="优惠统计"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryBillSummary } from '@/api/report'
export default {
  data() {
    return {
      tableData: [],
      emptyText: '暂无数据',
      excelServe: this.EXCELSERVE + '/backend/report/billSummary',
      time: [],
      count: 0,
      orderPriceAmout: 0.00,
      actualPriceAmout: 0.00
    }
  },
  created() {
    this.handelSearch()
  },
  methods: {
    getParams() {
      let params = {
        from: this.time[0] ? this.time[0] : '',
        to: this.time[1] ? this.time[1] : ''
      }
      return params
    },
    handelSearch() {
      this.emptyText = 'loading...'
      let params = this.getParams()
      let query = this.paramsToString(params)
      queryBillSummary(query).then(res => {
        this.tableData = []
        if(res.status == 200) {
          if(res.data.pageData.length > 0) {
            this.tableData = res.data.pageData
            this.count = res.data.total1
            this.orderPriceAmout = res.data.total2
            this.actualPriceAmout = res.data.total3
          }
        }
        if (this.tableData.length <= 0) {
            this.emptyText = '暂无数据'
        }
      })
    },
    handelExcel() {
      let params = this.getParams()
      params.excelExport = 1
      let query = this.paramsToString(params)
      window.open(`${this.excelServe}?${query}`)
    },
    paramsToString(obj) {
      let query = ''
      let keys = Object.keys(obj)
      let len = keys.length
      keys.forEach((key, index) => {
        query += `${key}=${obj[key]}`
        if (index < len - 1) {
          query += '&'
        }
      })
      return query
    },
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  margin-bottom: 20px;
}
.amout-price{
  margin-bottom: 15px;
  span{
    margin-right: 20px;
  }
}
</style>
