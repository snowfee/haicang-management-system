<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="活动编号" prop="id"></el-table-column>
        <el-table-column label="活动名称" prop="name"></el-table-column>
        <el-table-column label="活动类型" prop="couponType">
          <template slot-scope="scope">
            {{scope.row.couponType | keyToDes}}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
        <el-table-column label="优惠额" prop="discount">
          <template slot-scope="scope">
            <span v-if="scope.row.couponType === 'DISCOUNT'">折扣 {{scope.row.discount}}%</span>
            <span v-if="scope.row.couponType === 'FULL_MINUS'">满{{scope.row.full}}减{{scope.row.discount}}</span>
            <span v-if="scope.row.couponType === 'VOUCHER'">代金券{{scope.row.discount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否需要积分兑换" prop="isNeedPoints">
          <template slot-scope="scope">
            {{scope.row.isNeedPoints==0 ? '否' : `是 需要${scope.row.points}积分`}}
          </template>
        </el-table-column>
        <el-table-column label="是否永久不结束" prop="isPermanent">
          <template slot-scope="scope">
            {{scope.row.isPermanent==0 ? '否' : '是'}}
          </template>
        </el-table-column>
        <el-table-column label="全场通用" prop="isForAllProduct">
          <template slot-scope="scope">
            {{scope.row.isForAllProduct==0 ? '否' : '是'}}
          </template>
        </el-table-column>
        <el-table-column label="活动说明" show-overflow-tooltip prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" min-width="100px" fixed="right">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="pageIndex + 1"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { couponList, handleCoupon } from '@/api/product'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      let params = this.getParams()
      couponList(params).then(res => {
        this.tableData = res.data.coupons
        this.total = res.data.total
      })
    },
    getParams() {
      let params = {
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      return params
    },
    handleCurrentPageChange(val) {
      this.pageIndex = val - 1
      this.getListData()
    },
    handlePageSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleCoupon(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `updateCoupon?id=${id}`
      })
    },
    add() {
      this.$router.push({
        path: 'addCoupon'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
