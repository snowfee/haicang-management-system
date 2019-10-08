<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button @click="openAddDialog">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="类型名称" prop="name"></el-table-column>
        <el-table-column label="属性数量" prop="attributeCount"></el-table-column>
        <el-table-column label="设置">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="toAttributeList(scope.row.id)">属性列表</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="dialogTitle" :visible.sync="showDialog">
      <el-form :model="addForm" :rules="addRules" ref="addFrom" label-width="150px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="addForm.name" style="max-width: 350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="add('addFrom')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { skuAttributeList, handleSkuAttribute } from '@/api/materials'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: [],
      showDialog: false,
      addForm: {
        name: ''
      },
      addRules: {
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
      },
      dialogTitle: ''
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      skuAttributeList().then(res => {
        this.tableData = res.data
      })
    },
    openAddDialog() {
      this.dialogTitle = "添加类型"
      this.addForm.methodType = 'ADD'
      this.addForm.name = ''
      this.addForm.id = ''
      this.showDialog = true
    },
    handleEdit(row) {
      this.dialogTitle = "编辑类型"
      this.addForm.name = row.name
      this.addForm.id = row.id
      this.addForm.methodType = 'UPDATE'
      this.showDialog = true
    },
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {...this.addForm}
          handleSkuAttribute(params).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getListData()
            this.showDialog = false
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该属性类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id,
          methodType: 'DELETE'
        }
        handleSkuAttribute(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    toAttributeList(id) {
      this.$router.push({
        path:  `attributeList?id=${id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
