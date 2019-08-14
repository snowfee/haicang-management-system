<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="getListData">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form :model="listForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="版块名称">
            <el-input v-model="listForm.name"></el-input>
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
        <div class="top-right">
          <el-button @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="版块名称"></el-table-column>
        <el-table-column prop="type" label="版块类型">
          <template slot-scope="scope">
            <div>
              {{ scope.row.type | keyToDes }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
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
import { getHomeSections, handleHomeSection } from '@/api/appset'
export default {
  data() {
    return {
      tableData: [],
      listForm: {
        name: ''
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      getHomeSections(this.listForm.name).then(res => {
        this.tableData = res.data
      })
    },
    resetQuery() {
      this.listForm = {
        name: ''
      }
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该版块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleHomeSection(params).then(res => {
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
        path: `editStaff?id=${id}`
      })
    },
    add() {
      this.$router.push({
        path: 'addHomeBlock'
      })
    }
  }
}
</script>

<style>

</style>
