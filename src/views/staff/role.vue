<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="addRole">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="code" label="职位编号"></el-table-column>
        <el-table-column prop="name" label="职位名称"></el-table-column>
        <el-table-column label="操作" min-width="100px">
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
          :current-page="pageIndex + 1"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { roleList, handleRole } from '@/api/staff'
export default {
  name: 'RoleList',
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
      roleList(param).then(res => {
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
    addRole() {
      this.$router.push({
        path: 'addRole'
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `editRole?id=${id}`
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleRole(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }
}
</script>

<style>

</style>
