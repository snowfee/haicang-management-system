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
          <el-radio-group v-model="formData2.type" @change="handleTypeChange">
            <el-radio label="SINGLE">单个物料</el-radio>
            <el-radio label="MULTI">多个物料</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择物料" prop="materialIds">
          <el-button type="primary" @click="openMaterialsDialog">添加物料</el-button>
          <template v-if="materials && materials.length > 0 && materials[0] != 1">
            <el-table border :data="materials" style="margin-top: 20px">
              <el-table-column label="物料编号" prop="id"></el-table-column>
              <el-table-column label="物料名称" prop="name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteMaterial(scope.row.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <template v-if="materials && materials.length > 0">
          <el-form-item label="物料规格">
            <template v-if="formData2.type==='SINGLE'">
              <div class="sku-box" v-for="(attr, index) in attributeList" :key="index">
                <p>{{attr.name}}</p>
                <div v-for="(item, i) in attr.list" :key="i">
                  <el-checkbox-group v-model="item.selectedInputList">
                    <el-checkbox disabled v-for="(select, is) in item.inputList" :key="is" :label="select"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="sku-box" v-for="(attr, index) in materialSkuList" :key="index">
                <p>{{attr.name}}</p>
                <div>
                  <el-radio-group v-model="attr.materialSkuId">
                    <el-radio style="margin-bottom: 10px;" v-for="(item, i) in attr.list" :key="i" :label="item.id">{{item.skuAttribute}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <span v-if="skucCheckedErr" class="error">请填写/检查属性表</span>
            <el-table border :data="attributeResultList" v-if="formData2.type==='SINGLE'">
              <el-table-column v-for="(key, index) in checkedKeys" :key="index" :label="key">
                <template slot-scope="scope">
                  <span v-if="scope.row.skuAttribute">{{scope.row.skuAttribute[index]}}</span>
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
              <el-table-column label="操作" min-width="100px" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteSku(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="attributeResultList" v-else border>
              <el-table-column label="属性键名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.skuKey"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="属性值名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.skuValue"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.originalSalePrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="售价">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salePrice"></el-input>
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
import { getAllCategories, handleProduct, productsList } from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import materialDialog from '@/components/Dialog/materialDialog'
import upload from '@/components/Upload'
export default {
  components: {
    materialDialog,
    upload
  },
  data() {
    return {
      id: '',
      activeStep: 0,
      fileList: [],
      fileList_carousel: [],
      postQiniupData: null,
      // materialsType: 'single',
      categories: [],
      materials: [], // 商品添加的物料
      attributeList: [], // 单物料属性选择列表
      attributeResultList: [], // 属性结果列表
      materialSkuList: [], // 多物料属性选择列表
      skucCheckedErr: false, // 结果列表填写检查
      checkedKeys: [],
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
        carouselUrls: '',
        sort: ''
      },
      formData2: {
        type: 'SINGLE',
        materialIds: ''
      },
      ruleForm: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        subtitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
        category: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
        priceUnit: [{ required: true, message: '请输入商品计量单位', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        producedDate: [{ required: true, message: '请输入商品生产日期', trigger: 'blur' }],
        shelfLife: [{ required: true, message: '请输入商品保质期', trigger: 'blur' }],
        listUrl: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
        carouselUrls: [{ required: true, message: '请输入商品轮番图', trigger: 'blur' }],
        materialIds: [{ required: true, message: '请添加物料', trigger: 'blur' }],
        type: [{ required: true, message: '请选择商品组成', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getProduct()
    this.getQiniuUpToken()
    this.getAllCategories()
  },
  methods: {
    getProduct(){
      let params = {
        id: this.id
      }
      return productsList(params).then(res => {
        let data = res.data.products[0]
        this.formData1 = {
          id: this.id,
          name: data.name,
          subtitle: data.subtitle,
          priceUnit: data.priceUnit,
          weight: data.weight,
          producedDate: data.producedDate,
          shelfLife: data.shelfLife,
          remark: data.remark,
          category: data.category.allLineIds,
          listUrl: data.listUrl,
          carouselUrls: data.carouselUrls.join(','),
          sort: data.sort
        }
        this.fileList = [{url: data.listUrl}]
        this.fileList_carousel = data.carouselUrls.map(item => ({url: item}))
        this.formData2 = {
          type: data.type,
          materialIds: data.singleMaterialId ? data.singleMaterialId : data.combMaterialIds.join(','),
        }
        this.attributeResultList = data.productSkuList.map(item => ({...item}))
        if(data.type == 'SINGLE'){
          this.materials = [{...data.singleMaterial}]
          this.getSkuList(true)
          this.checkedKeys = data.productSkuList[0].skuSelectorList.map(item => (item.key))
          this.attributeResultList.forEach(item => {
            item.skuAttribute = item.skuSelectorList.map(sku => (sku.value))
          })
        } else {
          this.materials = [...data.combMaterials]
          let selectedSku = data.productSkuList[0].materialSkuIds.split(',')
          this.materialSkuList = this.materials.map((item, index) => ({
            name: item.name,
            list: item.materialSkuList,
            materialSkuId: +selectedSku[index]
          }))
          console.log('ok', this.materialSkuList)
          this.attributeResultList[0].skuKey = data.productSkuList[0].skuSelectorList[0].key
          this.attributeResultList[0].skuValue = data.productSkuList[0].skuSelectorList[0].value
        }
      })
    },
    handleTypeChange() {
      console.log('clear')
      this.attributeResultList = []
      this.materials = []
    },
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
      console.log('ok')
      this.showMaterialDialog = false
      this.formData2.materialIds = materials.map(item => item.id).join(',')
      if (this.formData2.type === 'SINGLE') {
        this.materials = [...materials]
        console.log('materials', this.materials)
      } else {
        this.materials = [...this.materials, ...materials]
        // 去重
        this.materials = this.uniqueById(this.materials)
      }
      this.getSkuList()
    },
    deleteMaterial(index) {
      this.materials.splice(index, 1)
      if (this.materials.length === 0) {
        this.formData2.materialIds = ''
        return
      }  
      this.addMaterial(this.materials)
    },
    getSkuList(init) {
      if (this.formData2.type === 'SINGLE') {
        this.attributeList = this.materials.map(item => {
        item.skuAttribute.attributeList.selectedSku = ''
          return {
            name: item.name,
            list: item.skuAttribute.attributeList
          }
        })
      } else {
        this.materialSkuList = this.materials.map(item => ({
          name: item.name,
          list: item.materialSkuList,
          materialSkuId: ''
        }))
      }
      console.log('attributeList', this.attributeList)
      // 如果有初始化数据就不设置attributeResultList
      if (init) {
        return
      }
      if (this.formData2.type === 'SINGLE') {
        this.attributeResultList = this.materials[0].materialSkuList.map(item => ({...item}))
        this.attributeResultList.forEach(item => {
          item.materialSkuIds = item.id
          delete item.id
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
      } else {
        this.attributeResultList = [{
          originalSalePrice: '',
          skuKey: '',
          skuValue: '',
          purchasePrice: ''
        }]
      } 
    },
    deleteSku(index) {
      this.attributeResultList.splice(index, 1)
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
      if (this.formData2.type === 'SINGLE') {
        valid = this.attributeResultList.every(item => item.originalSalePrice && item.salePrice)      
      } else {
        valid = this.attributeResultList.every(item => item.originalSalePrice && item.salePrice && item.skuKey && item.skuValue)
      }
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
            if (params.combMaterialIds) delete params.combMaterialIds
            params.productSkuList = this.attributeResultList.map(item => ({...item}))
            params.productSkuList.forEach(item => {
              let productSkuItem = {...item}
              this.checkedKeys.forEach((key, index) => {
                productSkuItem.skuAttribute[index] = `${key}:${item.skuAttribute[index]}`
              })
              productSkuItem.skuAttribute = productSkuItem.skuAttribute.join('|')
              item.skuAttribute = productSkuItem.skuAttribute
              item.materialSkuIds = item.materialSkuIds
              item.productId = this.id
              // delete item.id
            })
          } else {
            params.combMaterialIds = params.materialIds
            if (params.singleMaterialId) delete params.singleMaterialId
            let productSkuItem = {...this.attributeResultList[0]}
            productSkuItem.skuAttribute = this.attributeResultList[0].skuKey + ':' + this.attributeResultList[0].skuValue
            productSkuItem.materialSkuIds = this.materialSkuList.map(item => item.materialSkuId).join(',')
            productSkuItem.productId = this.id
            params.productSkuList = [{...productSkuItem}]
          }
          params.methodType = 'UPDATE'
          console.log('params', params)
          handleProduct(params).then(res => {
            this.$message({
              message: '商品修改成功',
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
