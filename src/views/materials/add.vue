<template>
  <div class="edit-container">
    <el-steps align-center :active="activeStep" class="edit-step">
      <el-step title="物料基本信息"></el-step>
      <el-step title="物料属性信息"></el-step>
    </el-steps>
    <transition name="fade-transform" mode="out-in">
      <el-form v-show="activeStep === 0" class="edit-form" ref="formData1" :model="formData1" :rules="ruleForm" label-width="150px">
        <el-form-item label="物料名称" prop="name">
          <el-input v-model="formData1.name"></el-input>
        </el-form-item>
        <el-form-item label="基本单位" prop="basicUnit">
          <el-input v-model="formData1.basicUnit"></el-input>
        </el-form-item>
        <el-form-item label="采购单位" prop="purchaseUnit">
          <el-input v-model="formData1.purchaseUnit"></el-input>
        </el-form-item>
        <el-form-item label="单位换算" prop="unitConversion">
          <el-input v-model="formData1.unitConversion" placeholder="单位换算(12瓶=1箱：12-1)"></el-input>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="nextStep('formData1')">下一步，填写属性信息</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <el-form v-show="activeStep === 1" :model="formData2" class="edit-form" :rules="ruleForm" label-width="150px">
        <el-form-item label="属性类型">
          <el-select v-model="attrIndex" @change="handleAttrSelectChange">
            <el-option v-for="(type, index) in attributes" :key="index" :label="type.name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格">
          <div v-for="(attr, index) in attributeList" :key="index">
            <p>{{attr.name}}</p>
            <!-- <el-checkbox-group v-model="">
              <el-checkbox v-for="() in inputList" label=""></el-checkbox>
            </el-checkbox-group> -->
          </div>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template> 

<script>
import { skuAttributeList } from '@/api/materials'
export default {
  data() {
    return {
      activeStep: 0,
      attributes: [], // 属性类型
      attributeList: [], // 属性列表
      attrIndex: '', 
      materialSkuList: [], 
      formData1: {
        name: '',
        basicUnit: '',
        purchaseUnit: '',
        unitConversion: ''
      },
      formData2: {
        attributeId: ''
      },
      ruleForm: {
        name: [{ required: true, trigger: 'blur' }],
        basicUnit: [{ required: true, trigger: 'blur' }],
        purchaseUnit: [{ required: true, trigger: 'blur' }],
        unitConversion: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAttributes()
  },
  methods: {
    getAttributes() {
      skuAttributeList().then(res => {
        this.attributes = res.data
      })
    },
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.activeStep = this.activeStep + 1
        }
      })
    },
    handleAttrSelectChange(val) {
      this.formData2.attributeId = this.attributes[val].id
      this.attributeList = this.attributes[val].attributeList
    }
  }
}
</script>

<style>

</style>
