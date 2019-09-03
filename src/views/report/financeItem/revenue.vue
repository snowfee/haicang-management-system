<template>
  <div>
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
        <el-form class="form" :model="searchForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="交易时间" prop="time">
            <el-date-picker
              v-model="searchForm.time"
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
      </div>
      <div class="box-content">
        <div class="amout-price">
          <span>合计</span>
          <span>实收金额：{{total1}}</span>
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
      <el-table-column prop="receivablePrice" label="应收金额（元）"></el-table-column>
      <el-table-column prop="cashPrice" label="现金实收（元）"></el-table-column>
      <el-table-column prop="alipayPrice" label="支付宝实收（元）"></el-table-column>
      <el-table-column prop="wechatPrice" label="微信实收（元）"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryFinanceForRevenue } from '@/api/report'
export default {
  data() {
    return {
      tableData: [],
      excelServe: 'http://www.haic168.com:9527/backend/report/financeForRevenue',
      emptyText: '暂无数据',
      total1: 0.00,
      searchForm: {
        time: []
      }
    }
  },
  created() {
    this.handelSearch()
  },
  methods: {
    getParams() {
      this.searchForm.from = this.searchForm.time[0] ? this.searchForm.time[0] : ''
      this.searchForm.to = this.searchForm.time[1] ? this.searchForm.time[1] : ''
      let params = Object.assign({}, this.searchForm)
      delete params.time
      return params
    },
    handelSearch() {
      this.emptyText = 'loading...'
      let params = this.getParams()      
      let query = this.paramsToString(params)
      queryFinanceForRevenue(query).then(res => {
        this.tableData = []
        if (res.status != 200) {
          this.emptyText = res.message
          return
        }
        if(res.data.pageData.length > 0) {
            this.tableData = res.data.pageData
            this.total1 = res.data.total1
          } else {
            this.emptyText = '暂无数据'
          }
      })
    },
    handleCategoryChange(val) {
      this.searchForm.categoryId = val[val.length - 1]
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
    handleReset() {
      this.searchForm = {
        orderStatus: '',
        orderId: '',
        time: [],
        payType: '',
        couponType: '',
        staffName: ''
      }
    },
    handleSeeDes(index, row) {
      this.dialogTitle = `订单明细-${row.orderId}`
      getOrderDetail(row.orderId).then(res => {
        if (res.status == 200) {
          this.tableData_des = res.data.orderItems
          this.showDialog = true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  margin-bottom: 30px;
  width: 830px;
}
.amout-price{
  margin-bottom: 15px;
  span{
    margin-right: 20px;
  }
}
p{
  margin: 10px 0px;
}
</style>
