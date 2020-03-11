<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑入库信息" />
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="类型" prop="targetRole">
        <el-select v-model="ruleForm.targetRole">
          <el-option label="供应商" value="SUPPLIER" />
          <el-option label="其他" value="OTHER" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.targetRole == 'SUPPLIER'" label="供应商" prop="supplierId">
        <el-select v-model="ruleForm.supplierId">
          <el-option v-for="(item, index) in suppliers" :key="index" :label="item.supplierName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" />
      </el-form-item>
      <el-form-item label="添加物料" prop="materialId">
        <el-button style="margin-bottom: 10px" type="primary" @click="showMaterialDialog=true">添加</el-button>
        <span v-show="showContentErr" class="error">请填写物料入库内容</span>
        <el-table border :data="materialSkuList">
          <el-table-column label="物料名称" prop="name" />
          <el-table-column label="物料ID" prop="materialId" />
          <el-table-column label="属性名称" prop="skuAttribute" />
          <el-table-column label="采购价格" prop="purchasePrice">
            <template slot-scope="scope">
              <el-input v-model="scope.row.purchasePrice" />
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="stock">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" />
            </template>
          </el-table-column>
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
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <material-dialog
      :show-dialog="showMaterialDialog"
      materials-type="single"
      @addMaterial="addMaterial"
      @close="closeMaterialDialog"
    />
  </div>
</template>

<script>
import { handleInventoryRecord, supplierList } from '@/api/invoicing'
import materialDialog from '@/components/Dialog/materialDialog'
export default {
  components: {
    materialDialog
  },
  data() {
    return {
      showMaterialDialog: false,
      showContentErr: false,
      preRuleForm: null,
      ruleForm: {
        operateType: 'INBOUND',
        targetRole: 'SUPPLIER',
        remark: '',
        materialId: '',
        supplierId: ''
      },
      rules: {
        materialId: [{ required: true, message: '请添加物料', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }]
      },
      suppliers: [],
      materials: [],
      materialSkuList: [],
      stepStatus: 'progress'
    }
  },
  created() {
    this.preRuleForm = { ...this.ruleForm }
    this.getSupplierList()
  },
  methods: {
    resetForm() {
      this.materialSkuList = []
      this.ruleForm = {
        operateType: 'INBOUND',
        targetRole: 'SUPPLIER',
        remark: '',
        materialId: '',
        supplierId: ''
      }
    },
    getSupplierList() {
      const params = {
        pageIndex: '0',
        pageSize: '9999'
      }
      supplierList(params).then(res => {
        this.suppliers = res.data.pageData
      })
    },
    deleteStokeContent(index) {
      this.ruleForm.materialId = ''
      this.materialSkuList.splice(index, 1)
    },
    addMaterial(materials) {
      console.log('materials', materials)
      this.materials = [...materials]
      this.ruleForm.materialId = materials[0].id
      this.materialSkuList = []
      materials.forEach(material => {
        material.materialSkuList.forEach(sku => {
          const materialSkuItem = {
            name: material.name,
            materialId: material.id,
            purchasePrice: sku.purchasePrice,
            stock: sku.stock,
            skuAttribute: sku.skuAttribute,
            id: sku.id // 物料的skuid
          }
          this.materialSkuList.push(materialSkuItem)
        })
      })
      this.showMaterialDialog = false
    },
    closeMaterialDialog() {
      this.showMaterialDialog = false
    },
    checkContent() {
      return !this.materialSkuList.some(item => !(item.purchasePrice || item.stock))
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checkContent()) {
            this.showContentErr = true
            return
          } else {
            this.showContentErr = false
          }
          const params = Object.assign({}, this.ruleForm)
          params.materialSkuList = [...this.materialSkuList]
          params.methodType = 'ADD'
          console.log('params', params)
          handleInventoryRecord(params).then(res => {
            this.$message({
              message: `入库物料添加成功`,
              type: 'success'
            })
            this.$router.replace({
              path: 'inbound'
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
