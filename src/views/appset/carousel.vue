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
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="jumpDestination" label="跳转目标">
          <template slot-scope="scope">
            <div>
              {{ scope.row.jumpDestination | keyToDes }}
            </div>
          </template>
        </el-table-column>
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
import { getBannerJump, handleBannerJump } from '@/api/appset'
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
      getBannerJump().then(res => {
        this.tableData = res.data
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleBannerJump(params).then(res => {
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
        path: `editJump?id=${id}&&type=HOME_CAROUSEL`
      })
    },
    add() {
      this.$router.push({
        path: 'addJump?type=HOME_CAROUSEL'
      })
    }
  }
}
</script>