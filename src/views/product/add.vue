<template>
  <div class="edit-container">
    <el-steps align-center :active="activeStep" class="edit-step">
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <transition name="fade-transform" mode="out-in">    
      <el-form v-show="activeStep === 0" class="edit-form" ref="formData1" :model="formData1" :rules="ruleForm" label-width="150px">
        <el-form-item label="商品分类" prop="category">
          <el-cascader 
          :options="categories" 
          v-model="formData1.category"
          :props="categoriesRule"
          expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData1.name"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="formData1.subtitle"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="priceUnit">
          <el-input v-model="formData1.priceUnit"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="weight">
          <el-input v-model="formData1.weight">
             <template slot="append">克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="listUrl">
          <upload :limit="1" :fileList="fileList" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>          
        </el-form-item>
        <el-form-item label="轮番图" prop="carouselUrls">
          <upload :limit="20" :fileList="fileList_carousel" :postQiniupData="postQiniupData" @uploadSuccess="uploadCarouselSuccess" @removeUploadFile="removeCarouselUploadFile"></upload>          
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="formData1.sort"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="producedDate">
          <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="formData1.producedDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
         <el-form-item label="保质期" prop="shelfLife">
          <el-input v-model="formData1.shelfLife"></el-input>
        </el-form-item>
        <el-form-item label="其他信息" prop="remark">
          <el-input v-model="formData1.remark"></el-input>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="nextStep('formData1')">下一步，填写商品属性</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <el-form v-show="activeStep === 1" :model="formData2" ref="formData2" class="edit-form" :rules="ruleForm" label-width="150px">
        <el-form-item label="商品组成" prop="type">
          <el-radio-group v-model="formData2.type">
            <el-radio label="SINGLE">单个物料</el-radio>
            <el-radio label="MULTI">多个物料</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择物料" prop="materialIds">
          <el-button @click="openMaterialsDialog">添加物料</el-button>
          <template v-if="materials && materials.length > 0">
            <el-table border :data="materials" style="margin-top: 20px">
              <el-table-column label="物料编号" prop="id"></el-table-column>
              <el-table-column label="物料名称" prop="name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteMaterial(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <template v-if="materials && materials.length > 0">
          <el-form-item label="物料规格">
            <div class="sku-box" v-for="(attr, index) in attributeList" :key="index">
              <p>{{attr.name}}</p>
              <div v-for="(item, i) in attr.list" :key="i">
                <p>{{item.name}}：</p>
                <el-checkbox-group v-model="item.selectedInputList">
                  <el-checkbox disabled v-for="(select, is) in item.inputList" :key="is" :label="select"></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <span v-if="skucCheckedErr" class="error">请填写/检查属性表</span>
            <el-table border :data="attributeResultList">
              <el-table-column v-for="(key, index) in checkedKeys" :key="index" :label="key">
                <template slot-scope="scope">
                  {{scope.row.skuAttribute[index]}}
                </template>
              </el-table-column>
              <el-table-column label="进价" prop="purchasePrice"></el-table-column>
              <el-table-column label="库存" prop="stock"></el-table-column>
              <el-table-column label="原价" prop="originalSalePrice">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.originalSalePrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="售价" prop="salePrice">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteSku(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
        <el-form-item size="large" class="form-btn">
          <el-button @click="previousStep()">上一步，填写商品信息</el-button>
          <el-button type="primary" @click="submit('formData2')">完成，提交商品</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <material-dialog 
      :showDialog = showMaterialDialog 
      :materialsType = formData2.type
      @addMaterial="addMaterial" 
      @close="closeMaterialDialog"></material-dialog>
  </div>
</template>

<script>
import { getAllCategories, handleProduct } from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import materialDialog from './components/materialDialog'
import upload from '@/components/Upload'
export default {
  components: {
    materialDialog,
    upload
  },
  data() {
    return {
      activeStep: 0,
      fileList: [],
      fileList_carousel: [],
      postQiniupData: null,
      // materialsType: 'single',
      categories: [],
      materials: [], // 商品添加的物料
      attributeList: [], // 属性选择列表
      attributeResultList: [], // 属性结果列表
      skucCheckedErr: false, // 结果列表填写检查
      checkedKeys: [],
      attributeResultList_single: [],
      showMaterialDialog: false,
      categoriesRule: {
        value: 'id',
        label: 'name'
      },
      formData1: {
        name: '',
        subtitle: '',
        priceUnit: '',
        weight: '',
        producedDate: '',
        shelfLife: '',
        remark: '',
        category: null,
        listUrl: '',
        carouselUrls: ''
      },
      formData2: {
        type: 'SINGLE',
        materialIds: ''
      },
      ruleForm: {
        name: [{ required: true, trigger: 'blur' }],
        subtitle: [{ required: true, trigger: 'blur' }],
        category: [{ required: true, trigger: 'blur' }],
        priceUnit: [{ required: true, trigger: 'blur' }],
        weight: [{ required: true, trigger: 'blur' }],
        producedDate: [{ required: true, trigger: 'blur' }],
        shelfLife: [{ required: true, trigger: 'blur' }],
        listUrl: [{ required: true, trigger: 'blur' }],
        carouselUrls: [{ required: true, trigger: 'blur' }],
        materialIds: [{ required: true, trigger: 'blur' }],
        type: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getQiniuUpToken()
    this.getAllCategories()
  },
  methods: {
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
      })
    },
    uploadSuccess(file, imgServe) {
      console.log(file)
      this.formData1.listUrl = `${imgServe}/${file[0].response.key}`
    },
    removeUploadFile(file, imgServe) {
      this.formData1.listUrl = ''
    },
    uploadCarouselSuccess(file, imgServe) {
      console.log(file)
      let arr = []
      file.forEach(item => {
        arr.push(`${imgServe}/${item.response.key}`)
      })
      this.formData1.carouselUrls = arr.join(',')
    },
    removeCarouselUploadFile(file, imgServe) {
      let arr = []
      file.forEach(item => {
        arr.push(`${imgServe}/${item.response.key}`)
      })
      this.formData1.carouselUrls = arr.join(',')
    },
    getAllCategories() {
      getAllCategories().then(res => {
        console.log('ok', res)
        this.categories = res.data
        this.deleteEmptyChildren(this.categories)
      })
    },
    deleteEmptyChildren(data) {
      data.forEach(item => {
        if (item.children.length === 0 ) {
          delete item.children
        } else {
          this.deleteEmptyChildren(item.children)
        }
      })
    },
    openMaterialsDialog() {
      this.showMaterialDialog = true
    },
    addMaterial(materials) {
      this.showMaterialDialog = false
      this.formData2.materialIds = materials.map(item => item.id).join(',')
      console.log('formData2', this.formData2)
      if (this.formData2.type === 'SINGLE') {
        this.materials = [...materials]
        console.log('materials', this.materials)
      } else {
        this.materials = [...this.materials, ...materials]
        // 去重
        this.materials = this.uniqueById(this.materials)
      }
      console.log('materials', this.materials)
      this.getSkuList(this.materials)
    },
    getSkuList() {
      this.attributeList = this.materials.map(item => {
        return {
          name: item.name,
          list: item.skuAttribute.attributeList
        }
      })
      console.log('attributeList', this.attributeList)
      if (this.formData2.type === 'SINGLE') {
        this.attributeResultList = [...this.materials[0].materialSkuList]
        this.attributeResultList.forEach(item => {
          let skuAttribute = []
          let arr = item.skuAttribute.split('|')
          arr.forEach(i => {
            skuAttribute.push(i.split(':')[1])
          })
          item.skuAttribute = skuAttribute;
        })
        this.checkedKeys = this.attributeList[0].list.map(item => {
          return item.name
        })
        console.log('checkedKeys', this.checkedKeys)
        console.log('attributeResultList', this.attributeResultList)
        console.log('attributeList', this.attributeList)
      }
      
    },
    deleteSku(index) {
      this.attributeResultList.splice(index, 0)
    },
    uniqueById(arr) {
      if (!Array.isArray(arr)) {
        console.log('type error')
        return
      }
      let obj = {}
      return arr.filter(item => {
        if (!obj[item.id]) {
          obj[item.id] = 1
          return true
        } else {
          ++obj[item.id]
          return false
        }
      })
    },
    closeMaterialDialog() {
      this.showMaterialDialog = false
    },
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.activeStep = this.activeStep + 1
          console.log(this.activeStep)
        }
      })
    },
    previousStep() {
      this.activeStep = this.activeStep - 1
    },
    skuListValidator() {
      let valid = true
      valid = this.attributeResultList.every(item => item.originalSalePrice && item.salePrice  )
      return valid
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.skuListValidator()) {
            this.skucCheckedErr = true
            return
          } else {
            this.skucCheckedErr = false
          }
          let params = {...this.formData1, ...this.formData2}
          if (params.category[0]) params.categoryId1 = params.category[0]
          if (params.category[1]) params.categoryId2 = params.category[1]
          if (params.category[2]) params.categoryId3 = params.category[2]
          delete params.category
          if (params.type === 'SINGLE') {
            params.singleMaterialId = params.materialIds
          } else {
            params.combMaterialIds = params.materialIds
          }
          params.productSkuList = [...this.attributeResultList]
          params.productSkuList.forEach(item => {
            this.checkedKeys.forEach((key, index) => {
              item.skuAttribute[index] = `${key}:${item.skuAttribute[index]}`
            })
            item.skuAttribute = item.skuAttribute.join('|')
          })
          params.methodType = 'ADD'
          console.log('params', params)
          handleProduct(params).then(res => {
            this.$message({
              message: '商品添加成功',
              type: 'success'
            });
            this.$router.replace({
              path: `list`
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p{
  margin: 0;
  padding: 0;
}
.sku-box{
  background-color: #f8f9fc;
  // border: 1px solid #ebeef5;
  padding: 10px;
}
.error{
  font-size: 12px;
  color: red;
}
</style>
