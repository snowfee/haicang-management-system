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
        <el-form :model="searchForm" label-width="150px" label-position="right" :inline="true" >
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
          <el-form-item label="类目">
            <el-cascader v-if="categories"
              expand-trigger="hover"
              filterable
              placeholder="选择类目"
              style="width:400px"
              :options="categories"
              @change="handleCategoryChange">
            </el-cascader>
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
    </div>
    <el-table border :data="tableData" style="width: 100%;">
      <template slot="empty">
        <div>
          {{ emptyText }}
        </div>
      </template>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <!-- <el-table-column prop="memberPrice" label="售卖单价（元）"></el-table-column> -->
      <el-table-column prop="orderNum" label="销量"></el-table-column>
      <el-table-column prop="receivablePrice" label="应收金额（元）"></el-table-column>
      <el-table-column prop="actualPrice" label="实收金额（元）"></el-table-column>
      <!-- <el-table-column prop="couponPrice" label="优惠金额（元）"></el-table-column> -->
      <el-table-column prop="sales" label="订单数"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryProductReport } from '@/api/report'
import { getAllCategories } from '@/api/product'
export default {
  data() {
    return {
      tableData: [],
      categories: null,
      excelServe: 'http://www.haic168.com:9527/backend/report/productReport',
      emptyText: '暂无数据',
      searchForm: {
        categoryId: '',
        time: []
      }
    }
  },
  created() {
    this.handelSearch()
    this.getAllCategories()
  },
  methods: {
    getParams() {
      this.searchForm.from = this.searchForm.time[0] ? this.searchForm.time[0] : ''
      this.searchForm.to = this.searchForm.time[1] ? this.searchForm.time[1] : ''
      let params = Object.assign({}, this.searchForm)
      delete params.time
      return params
    },
    getAllCategories() {
      getAllCategories().then(res => {
        if (res.status == 200) {
          this.categories = res.data
          this.getCategoriesFormat(this.categories)
          console.log(this.categories)
        }
      })
    },
    getCategoriesFormat(data) {
      data.forEach(item => {
        item.label = item.name
        item.value = item.id
        if (item.children.length > 0) {
          this.getCategoriesFormat(item.children)
        } else {
          if (item.children) delete item.children
          return
        }
      })
    },
    handelSearch() {
      this.emptyText = 'loading...'
      let params = this.getParams()      
      let query = this.paramsToString(params)
      queryProductReport(query).then(res => {
        this.tableData = []
        if (res.status != 200) {
          this.emptyText = res.message
          return
        }
        if(res.data.pageData.length > 0) {
            this.tableData = res.data.pageData
            this.count = res.data.total1
            this.orderPriceAmout = res.data.total2
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
