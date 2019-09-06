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
      <el-form v-show="activeStep === 1" ref="formData2" :model="formData2" class="edit-form" :rules="ruleForm" label-width="150px">
        <el-form-item label="属性类型" prop="attributeId">
          <el-select v-model="formData2.attributeId" @change="handleAttrSelectChange">
            <el-option v-for="(type, index) in attributes" :key="index" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格" v-if="attributeList && attributeList.length>0">
          <div class="sku-box" v-for="(attr, index) in attributeList" :key="index">
            <p>{{attr.name}}：</p>
            <el-checkbox-group v-model="checkedAttr[attr.name]" @change="handleCheckedChange">
              <el-checkbox v-for="(item, i) in attr.inputList" :key="i" :label="item"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button type="primary" style="margin: 15px 0" @click="flashSkuTable">刷新列表</el-button>
          <span v-if="skucCheckedErr" class="error">{{skuErrText}}</span>
          <el-table border :data="materialSkuList" v-if="showSkuTable">
            <el-table-column v-for="(key, index) in checkedKeys" :key="index" :label="key">
              <template slot-scope="scope">
                {{scope.row.skuAttribute[index]}}
              </template>
            </el-table-column>
            <el-table-column label="商品进价" prop="purchasePrice">
              <template slot-scope="scope">
                <el-input v-model="scope.row.purchasePrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="stock">
              <template slot-scope="scope">
                <el-input type="number" class="input-number" v-model="scope.row.stock"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteSku(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button @click="previousStep">上一步，填写基本信息</el-button>
          <el-button type="primary" @click="submit('formData2')">完成，提交</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template> 

<script>
import { skuAttributeList, handleMaterial, getMaterialById } from '@/api/materials'
export default {
  data() {
    return {
      id: '',
      activeStep: 0,
      attributes: [], // 属性类型
      attributeList: [], // 属性列表
      attrIndex: '', 
      checkedAttr: null,
      checkedKeys: [],
      skucCheckedErr: false,
      skuErrText: '每一项至少选中一个',
      showSkuTable: false,
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
        unitConversion: [
          { required: true, trigger: 'blur' },
          {pattern:/^[1-9]+\-[1-9]+$/, message: '格式不正确', trigger: 'blur'}
        ],
        attributeId: [{ required: true, message: '请选择属性类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    if (this.id) {
      this.getEditMaterial()
    } else {
      this.getAttributes()
    }
  },
  methods: {
    async getEditMaterial() {
      await this.getAttributes()
      getMaterialById(this.id).then(res => {
        let data = res.data
        this.formData1 = {
          id: data.id,
          name: data.name,
          basicUnit: data.basicUnit,
          purchaseUnit: data.purchaseUnit,
          unitConversion: data.unitConversion
        }
        this.formData2 = {
          attributeId: data.attributeId
        }
        this.materialSkuList = [...data.materialSkuList]
        this.materialSkuList.forEach(item => {
          let skuList = item.skuAttribute.split('|')
          let arr = []
          skuList.forEach(sku => {
            arr.push(sku.split(':')[1])
          })
          item.skuAttribute = [...arr]
        })
        this.checkedAttr = {}
        this.handleAttrSelectChange(this.formData2.attributeId)
        data.skuAttribute.attributeList.forEach(item => {
          item.selectedInputList.forEach(checked => {
            this.checkedAttr[item.name].push(checked)
          })
        })
        this.showSkuTable = true
      })
    },
    getAttributes() {
      return skuAttributeList().then(res => {
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
      let attribute = this.attributes.filter(item => item.id === val)[0]
      this.attributeList = attribute.attributeList
      this.checkedAttr = {}
      this.attributeList.forEach(item => {
        this.$set(this.checkedAttr, item.name, [])
      })
      this.checkedKeys = Object.keys(this.checkedAttr)
    },
    handleCheckedChange(val) {
      this.skucCheckedErr = false
    },
    skuCheckedValidator() {
      let validate = this.checkedKeys.every(key => this.checkedAttr[key].length > 0)
      this.skuErrText = '每一项至少选中一个'
      return validate
    },
    flashSkuTable() {
      console.log('ok', this.checkedAttr)
      if (!this.skuCheckedValidator()) {
        this.skucCheckedErr = true
        return
      }
      
      let keys = this.checkedKeys
      let len = keys.length
      let skuList = []
      this.materialSkuList = []
      if (len === 1) {
        this.checkedAttr[keys[0]].forEach(item => {
          skuList.push([item])
        })
      }
      if (len === 2) {
        this.checkedAttr[keys[0]].forEach(item => {
          this.checkedAttr[keys[1]].forEach(item2 => {
            skuList.push([item, item2])
          })
        })
      }
      if (len === 3) {
        this.checkedAttr[keys[0]].forEach(item => {
          this.checkedAttr[keys[1]].forEach(item2 => {
            this.checkedAttr[keys[2]].forEach(item3 => {
              skuList.push([item, item2, item3])
            })
          })
        })
      }
      skuList.forEach(item => {
        let obj = {
          purchasePrice: '',
          stock: '',
          skuAttribute: item // 格式['', '', '']
        }
        this.materialSkuList.push(obj)
      })
      this.showSkuTable = true
    },
    deleteSku(index) {
      console.log(index)
      this.materialSkuList.splice(index, 1)
    },
    previousStep() {
      this.activeStep = this.activeStep - 1
    },
    skuListValidator() {
      let valid = true
      if (!this.materialSkuList || this.materialSkuList.length <= 0) {
        valid = false
      } else {
        valid = this.materialSkuList.every(item => item.purchasePrice )
      }
      this.skuErrText = '请填写/检查属性表'
      return valid
    },
    submit(formName){
      console.log('222', this.materialSkuList)
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.skuCheckedValidator()) {
            this.skucCheckedErr = true
            return
          }
          if (!this.skuListValidator()) {
            this.skucCheckedErr = true
            return
          }
          let params = {...this.formData1, ...this.formData2}
          params.materialSkuList = [...this.materialSkuList]
          params.materialSkuList.forEach(item => {
            this.checkedKeys.forEach((key, index) => {
              item.skuAttribute[index] = `${key}:${item.skuAttribute[index]}`
            })
            item.skuAttribute = item.skuAttribute.join('|')
          })
          params.methodType = 'UPDATE'
          console.log('params', params)
          handleMaterial(params).then(res => {
            this.$message({
              message: '物料更新成功',
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
  border: 1px solid #ebeef5;
  padding: 10px;
}
.error{
  font-size: 12px;
  color: red;
}
</style>
