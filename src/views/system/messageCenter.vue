<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button>重置</el-button>
          <el-button type="primary" @click="getListData">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="listForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="标题" prop="title">
            <el-input v-model="listForm.title"></el-input>
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
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="picUrl" label="图片">
          <template slot-scope="scope">
            <el-button @click="seePic(scope.row.picUrl)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="isSend" label="是否已推送">
          <template slot-scope="scope">
            {{scope.row.isSend === 0 ? '否' : '是'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button 
              v-if="scope.row.isSend === 0"
              size="mini" 
              type="text"
              @click="handleSend(scope.row.id)">推送</el-button>
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
    <el-dialog title="" :visible.sync="showPicDialog" width="30%">
      <img :src="picUrl" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import { queryMessageCenter, handleMessageCenter } from '@/api/system'
export default {
  data() {
    return {
      tableData: [],
      listForm: {
        title: ''
      },
      showPicDialog: false,
      pageSize: 10,
      picUrl: '',
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
        pageSize: this.pageSize,
        title: this.listForm.title
      }
      queryMessageCenter(param).then(res => {
        this.tableData = res.data.messageCenterList
        this.total = res.data.total
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
        path: 'addMessage'
      })
    },
    seePic(picUrl) {
      this.picUrl = picUrl
      this.showPicDialog = true
    },
    handleSend(id) {
      let params = {
        id,
        methodType: 'SEND_MESSAGE'
      }
      this.$confirm('此操作将推送该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleMessageCenter(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '推送成功!'
          })
        })
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `updatemessage?id=${id}`
      })
    },
    handleDelete(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleMessageCenter(params).then(res => {
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
