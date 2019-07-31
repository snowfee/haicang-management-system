<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button @click="addStaff">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <div>
              {{ scope.row.sex | keyToDes }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role.name" label="职位"></el-table-column>
        <el-table-column prop="telephone" label="手机号"></el-table-column>
        <el-table-column prop="idNumber" label="身份证"></el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import { staffList } from '@/api/staff'
export default {
  name: 'StaffList',
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
      staffList(param).then(res => {
        this.tableData = res.data.staffs
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
    addStaff() {
      this.$router.push({
        path: 'addStaff'
      })
    }
  }
}
</script>

<style>

</style>
