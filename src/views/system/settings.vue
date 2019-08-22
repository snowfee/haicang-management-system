<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="编码"></el-table-column>
        <el-table-column prop="key" label="参数key"></el-table-column>
        <el-table-column prop="value" label="参数值"></el-table-column>
        <el-table-column prop="desc" show-overflow-tooltip label="参数描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
    </div>
  </div>
</template>

<script>
import { paramSettingList, handleParamSetting } from '@/api/system'
export default {
  data() {
    return {
      tableData: []
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
      paramSettingList().then(res => {
        this.tableData = res.data
      })
    },
    add() {
      this.$router.push({
        path: 'addparam'
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleParamSetting(params).then(res => {
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
        path: `updateparam?id=${id}`
      })
    }
  }
}
</script>

<style>

</style>
