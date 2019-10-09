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
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
        <el-table-column prop="contactName" label="联系人姓名"></el-table-column>
        <el-table-column prop="telephone" label="电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            启用：<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" 
            @change="handleStatusChange($event, scope.row.id, scope.$index)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="settleType" label="结算方式">
          <template slot-scope="scope">
            {{scope.row.settleType | keyToDes}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
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
  </div>
</template>

<script>
import { supplierList, handleSupplier } from '@/api/invoicing'
export default {
  data() {
    return {
      tableData: [],
      pageSize: 10,
      total: 0,
      pageIndex: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getListData()
    },
    getListData() {
      let param = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      supplierList(param).then(res => {
        this.tableData = res.data.pageData
        this.total = res.data.count
      })
    },
    handleCurrentPageChange(val) {
      this.pageIndex = val - 1
      this.getListData()
    },
    handlePageSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    add() {
      this.$router.push({
        path: 'addSupplier'
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleSupplier(params).then(res => {
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
        path: `updateSupplier?id=${id}`
      })
    },
    handleStatusChange(val, id, index) {
      let params = {
        id,
        status: val,
        methodType: 'UPDATE'
      }
      this.$confirm('此操作将修改供应商状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleSupplier(params).then(res => {
          // this.getListData()
          this.$message({
            type: 'success',
            message: '状态修改成功!'
          })
        }, err => {
          if (val === 0) {
            this.tableData[index].status = 1
          } else {
            this.tableData[index].status = 0
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
