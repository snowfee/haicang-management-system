<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑盘点信息" />
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="盘点类型" prop="type">
        <el-select v-model="ruleForm.type">
          <el-option v-for="(type, index) in types" :key="index" :label="type.name" :value="type.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="ruleForm.status" active-text="已完成" inactive-text="未完成" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="添加物料" prop="content">
        <el-button style="margin-bottom: 10px" type="primary" @click="showMaterialDialog=true">添加</el-button>
        <span v-show="showContentErr" class="error">请添加|填写物料盘点内容</span>
        <el-table border :data="stockCheckContent">
          <el-table-column label="物料ID" prop="materialId" />
          <el-table-column label="属性名称" prop="skuAttribute" />
          <el-table-column label="账面数量" prop="systemCount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.systemCount" @blur="computeLoss(scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column label="实盘数量" prop="actualCount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.actualCount" @blur="computeLoss(scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column label="采购价格" prop="purchasePrice" />
          <el-table-column label="损益数量" prop="lossCount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lossCount" readonly />
            </template>
          </el-table-column>
          <el-table-column label="损益金额" prop="lossAmount">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lossAmount" readonly />
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="stock" />
          <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100px" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="deleteStokeContent(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <material-dialog
      :show-dialog="showMaterialDialog"
      materials-type="MULTI"
      @addMaterial="addMaterial"
      @close="closeMaterialDialog"
    />

  </div>
</template>

<script>
import { handleStockCheck, stockCheckItemList } from '@/api/invoicing'
import materialDialog from '@/components/Dialog/materialDialog'
export default {
  components: {
    materialDialog
  },
  data() {
    return {
      stockCheckContent: [],
      showMaterialDialog: false,
      showContentErr: false,
      preRuleForm: null,
      types: [{ name: '日结', value: 'DAILY' }, { name: '周结', value: 'WEEKLY' }, { name: '月结', value: 'MONTHLY' }, { name: '其他', value: 'OTHER' }],
      ruleForm: {
        type: 'DAILY',
        remark: '',
        status: 0,
        content: {
          items: []
        }
      },
      rules: {
        type: [{ required: true, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        status: [{ required: true, trigger: 'blur' }]
        // content: [{ required: true, trigger: 'blur' }]
      },
      materials: [],
      stepStatus: 'progress'
    }
  },
  created() {
    this.preRuleForm = { ...this.ruleForm }
  },
  methods: {
    getTheCheck() {
      stockCheckItemList(this.id).then(res => {
        this.ruleForm = { ...res.data }
      })
    },
    computeLoss(index) {
      const actualCount = this.stockCheckContent[index].actualCount
      const systemCount = this.stockCheckContent[index].systemCount
      const purchasePrice = this.stockCheckContent[index].purchasePrice
      if (actualCount && systemCount) {
        this.stockCheckContent[index].lossCount = actualCount - systemCount
        this.stockCheckContent[index].lossAmount = (actualCount - systemCount) * purchasePrice
      }
    },
    deleteStokeContent(index) {
      this.stockCheckContent.splice(index, 1)
    },
    addMaterial(materials) {
      console.log('materials', materials)
      this.materials = [...this.materials, ...materials]
      // 去重
      this.materials = this.uniqueById(this.materials)
      this.stockCheckContent = []
      materials.forEach(material => {
        material.materialSkuList.forEach(sku => {
          const stockCheckContentItem = {
            materialId: material.id,
            systemCount: '',
            actualCount: '',
            purchasePrice: sku.purchasePrice,
            lossCount: '',
            lossAmount: '',
            remark: '',
            balanceStatus: 0,
            stock: sku.stock,
            skuAttribute: sku.skuAttribute,
            id: sku.id // 物料的skuid
          }
          this.stockCheckContent.push(stockCheckContentItem)
        })
      })
      this.showMaterialDialog = false
    },
    uniqueById(arr) {
      if (!Array.isArray(arr)) {
        console.log('type error')
        return
      }
      const obj = {}
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
    checkContent() {
      return !this.stockCheckContent.some(item => !(item.systemCount || item.actualCount))
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checkContent() || this.stockCheckContent.length === 0) {
            this.showContentErr = true
            return
          } else {
            this.showContentErr = false
            this.ruleForm.content.items = [...this.stockCheckContent]
          }
          const params = Object.assign({}, this.ruleForm)
          params.methodType = 'ADD'
          console.log('params', params)
          handleStockCheck(params).then(res => {
            this.$message({
              message: `盘点添加成功`,
              type: 'success'
            })
            this.$router.replace({
              path: 'inventoryCheck'
            })
          })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.error{
  color: red;
}
</style>
