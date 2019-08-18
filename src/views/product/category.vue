<template>
  <div class="edit-container">
    <div style="margin: 20px 0 0 120px; ">
      <el-cascader
        expand-trigger="hover"
        filterable
        clearable
        change-on-select
        placeholder="选择类目"
        style="width:500px"
        :options="categories"
        :disabled="isEditForm"
        v-model="selectedCategoryOptions"
        @change="handleCategoryChange">
      </el-cascader>
      <div style="margin-top: 30px">
        <el-button class="add-btn" type="primary" @click="addCategory()" :disabled="isEditing">添加类目</el-button>
        <el-button class="add-btn" type="primary" @click="handleEdit()" :disabled="!canEditAndDe || isAdding">编辑类目</el-button>
        <el-button class="add-btn" type="primary" @click="handleDelete()" :disabled="!canEditAndDe || isAdding || isEditing">删除类目</el-button>
      </div>
    </div>
    <div v-if="showDialog" style="margin-left:120px">
      <h3>{{dialogTitle}}</h3>
      <el-form :model="dialogForm" ref="dialogForm" style="width: 500px;" :label-width="formLabelWidth" :rules="rules">
        <el-form-item :label="categoriesLabel">
          <el-cascader v-if="categories"
            expand-trigger="hover"
            disabled
            change-on-select
            style="width:380px"
            :options="categories"
            v-model="selectedCategoryOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNo">
          <el-input v-model.number="dialogForm.orderNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图标"  prop="thumbnailUrl">
           <upload :limit="1" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>
        </el-form-item>
        <template v-if="(dialogTitle === '添加类目' && dialogForm.level === 1) || (dialogTitle === '编辑类目' && dialogForm.level === 2)">
          <el-form-item label="下级展示形式">
            <el-radio-group v-model="dialogForm.displayMode" style="line-height: 40px">
              <el-radio label="THRID_CATEGORY">展示三级类目</el-radio>
              <el-radio label="CATEGORY_PRODUCT">展示类目和商品</el-radio>
              <el-radio label="PRODUCT">只展示商品</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="resetForm('dialogForm', 'edit')">重 置</el-button>
        <el-button type="warning" @click="closeForm('dialogForm', 'close')">取 消</el-button>
        <el-button type="primary" @click="submitForm()">提 交</el-button>
      </div>  
   </div>
  </div>
</template>
<script>
import { getAllCategories, handleCategory, getCategoryById } from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import upload from '@/components/Upload'
import { constants } from 'fs';
export default {
  components: {
    upload
  },
  data() {
    return {
      categories: [{
        label: '全部商品',
        value: 0,
        children: []
      }],
      isAdding: false,
      isEditing: false,
      listPicList: [],
      selectedCategoryOptions: [0],
      selectedCategoryObj: null,
      dialogTitle: '',
      formLabelWidth: '120px',
      showDialog: false,
      canEditAndDe: false,
      postQiniupData: null,
      isEditForm: false,
      perDialogForm: null,
      categoryId: 0,
      categoriesLabel: '',
      dialogForm: {
        name: '',
        orderNo: '',
        thumbnailUrl: '',
        level: 0,
        displayMode: 'THRID_CATEGORY'
      },
      rules: {
        name: [{ required: true, message: '请输入类目名称', trigger: 'blur' }],
        orderNo: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { type: 'number', message: '格式错误应为数值', trigger: 'blur' }
        ],
        thumbnailUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getQiniuUpToken()
    this.init()
  },
  methods: {
    init() {
      this.getAllCategories()
    },
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
      })
    },
    uploadSuccess(file, imgServe) {
      console.log(file)
      this.dialogForm.thumbnailUrl = `${imgServe}/${file[0].response.key}`
    },
    removeUploadFile(file, imgServe) {
      this.dialogForm.thumbnailUrl = ''
    },
    getAllCategories() {
      getAllCategories().then(res => {
        if (res.status == 200) {
          this.categories[0].children = res.data
          this.getCategoriesFormat(this.categories[0].children)
        }
      })
    },
    handleUpFail(err) {
      this.$message.error(err);
    },
    getCategoriesFormat(data) {
      data.forEach(item => {
        item.label = item.name
        item.value = item.id
        if (item.children.length > 0) {
          this.getCategoriesFormat(item.children)
        } else {
          if (item.children) delete item.children
          return
        }
      })
    },
    handleCategoryChange(value) {
      this.canEditAndDe = value.length > 1
      this.categoryId = value[value.length - 1]
      this.selectedCategoryObj = this.getCascaderObj(value, this.categories)
      console.log(this.selectedCategoryObj)
      this.dialogForm.level = this.selectedCategoryObj.level
    },
    getCascaderObj(val, opt) {
      let obj = null
      const len = val.length 
      val.forEach((value, index) => {
        for (var itm of opt) {
          if (itm.value == value) {
            if (index < len - 1) {
              opt = itm.children
              break
            } else {
              obj = itm
            }
          }
        }
      })
      return obj
    },
    handleEdit() {
      this.isEditForm = true
      this.dialogTitle = "编辑类目"
      this.categoriesLabel = '当前类目'
      getCategoryById(this.categoryId).then(res => {
        if (res.status == 200) {
          this.dialogForm = {
            id: res.data.id,
            name: res.data.name,
            orderNo: res.data.sort,
            thumbnailUrl: res.data.thumbnailUrl
          }
          if (res.data.thumbnailUrl) {
            this.listPicList = [{url: res.data.thumbnailUrl}]
          } else {
            this.listPicList = []
          }
          this.perDialogForm = JSON.parse(JSON.stringify(this.dialogForm))
          this.isEditing = true
          this.showDialog = true
        }
      })
    },
    handleDelete() {
      let params = {
        id: this.categoryId,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将删除该类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleCategory(params).then(res => {
          if (res.status == 200) {
            this.getAllCategories()
            this.selectedCategoryOptions = [0]
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })          
      })
    },
    addCategory() {
      this.dialogTitle = "添加类目"
      this.categoriesLabel = '父级类目'
      this.isAdding = true
      this.showDialog = true
    },
    closeForm(formName, type) {
      this.isEditForm = false
      this.showDialog = false
      this.resetForm(formName, type)
    },
    resetForm(formName, type) {
      this.$refs[formName].clearValidate()
      if (this.dialogTitle == '编辑类目' && type != 'close') {
        this.dialogForm = JSON.parse(JSON.stringify(this.perDialogForm))
        if (this.dialogForm.thumbnailUrl) {
          this.listPicList = [{url: this.dialogForm.thumbnailUrl}]
        } else {
          this.listPicList = []
        }
      } else {
        this.clearForm()
      }
      this.isAdding = false
      this.isEditing = false
    },
    clearForm() {
      this.dialogForm = {
        name: '',
        orderNo: '',
        thumbnailUrl: '',
        level: this.dialogForm.level,
        displayMode: 'THRID_CATEGORY'
      }
      this.listPicList = []
    },
    submitForm() {
       this.$refs.dialogForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dialogForm)
          if (this.dialogTitle == '添加类目') {
            params.methodType = 'ADD'
            if ( this.selectedCategoryOptions.length > 1) {
              params.parentId = this.categoryId
            }
          } else if (this.dialogTitle == '编辑类目') {
            params.methodType = 'UPDATE'
            if ( this.selectedCategoryOptions.length > 2) {
              params.parentId = this.selectedCategoryOptions[this.selectedCategoryOptions.length - 2]
            }
          }
          
          handleCategory(params).then((res) => {
            if (res.status == 200) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              })
              this.getAllCategories()
              this.isEditForm = false
              this.isAdding = false
              this.isEditing = false
              this.showDialog = false
              this.resetForm('dialogForm', 'close')
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    handleImgExceed() {
      this.$message({
        message: '只能上传一张图片',
        type: 'warning'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn{
  margin-bottom: 24px;
}
.pagination-block{
  float: right;
  margin-top: 20px;
}
.dialog-footer{
  width: 500px;
  text-align: right;
}
</style>
