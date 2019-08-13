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
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="属性名称" prop="name"></el-table-column>
        <!-- <el-table-column label="属性类型" prop="attributeId"></el-table-column> -->
        <el-table-column label="可选值列表" prop="inputList">
          <template slot-scope="scope">
            {{scope.row.inputList.join(', ')}}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
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
import { getAttributeListById, handleSkuAttributeItem } from '@/api/materials';
export default {
  data() {
    return {
      tableData: [],
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getListData()
  },
  methods: {
    getListData() {
      getAttributeListById(this.id).then(res => {
        this.tableData = res.data
      })
    },
    add() {
      this.$router.push({
        path: `addAttribute/${this.id}`
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `editAttribute/${this.id}?id=${id}`
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleSkuAttributeItem(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
  }
}
</script>

<style>

</style>
