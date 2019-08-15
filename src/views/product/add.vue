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
          <el-input v-model="formData1.weight"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="formData1.sort"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="producedDate">
          <el-input v-model="formData1.producedDate"></el-input>
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
      <el-form v-show="activeStep === 1" :model="formData2" class="edit-form" :rules="ruleForm" label-width="150px">
        <el-form-item label="商品组成">
          <el-radio-group v-model="materialsType">
            <el-radio label="single">单个物料</el-radio>
            <el-radio label="combination">多个物料</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择物料">
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
        <!-- <template>
          <el-form-item label="物料规格">
            <div class="">
              <p></p>
            </div>
          </el-form-item>
        </template> -->
        <el-form-item size="large" class="form-btn">
          <el-button @click="previousStep()">上一步，填写商品信息</el-button>
          <el-button type="primary" @click="submit()">完成，提交商品</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <material-dialog 
      :showDialog = showMaterialDialog 
      :materialsType = materialsType 
      @addMaterial="addMaterial" 
      @close="closeMaterialDialog"></material-dialog>
  </div>
</template>

<script>
import { getAllCategories } from '@/api/product'
import materialDialog from './components/materialDialog'
export default {
  components: {
    materialDialog
  },
  data() {
    return {
      activeStep: 0,
      materialsType: 'single',
      categories: [],
      materials: [], // 商品添加的物料
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
        category: null
      },
      formData2: {
        remark: ''
      },
      ruleForm: {
        name: [{ required: true, trigger: 'blur' }],
        subtitle: [{ required: true, trigger: 'blur' }],
        category: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAllCategories()
  },
  methods: {
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
      if (this.materialsType === 'single') {
        this.materials = [...materials]
        return
      }
      this.materials = [...this.materials, ...materials]
      // 去重
      this.materials = this.uniqueById(this.materials)
      console.log('materials', this.materials)
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
    submit() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
