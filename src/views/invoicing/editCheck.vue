<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑盘点信息"></el-step>
    </el-steps>
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="盘点类型" prop="type">
        <el-select v-model="ruleForm.type">
          <el-option v-for="(type, index) in types" :key="index" :label="type.name" :value="type.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
       <el-form-item label="新增盘点" prop="address">
        <el-button @click="showAddCheckDialog = true">添加</el-button>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增盘点" :visible.sync="showAddCheckDialog" width="50%">
      <el-form :model="addCheckForm" ref="addCheckForm" :rules="addCheckRules" label-width="100px">
        <el-form-item label="选择物料" prop="materialId">
          <el-button @click="showMaterialDialog=true">添加</el-button>
        </el-form-item>
        <el-form-item label="账面数量" prop="systemCount">
          <el-input v-model="addCheckForm.systemCount"></el-input>
        </el-form-item>
        <el-form-item label="实盘数量" prop="actualCount">
          <el-input v-model="addCheckForm.actualCount"></el-input>
        </el-form-item>
        <el-form-item label="采购价格" prop="purchasePrice">
          <el-input v-model="addCheckForm.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="损益数量" prop="lossCount">
          <el-input readonly v-model="addCheckForm.lossCount" :value="addCheckForm.actualCount - addCheckForm.systemCount"></el-input>
        </el-form-item>
        <el-form-item label="损益金额" prop="lossAmount">
          <el-input readonly v-model="addCheckForm.lossAmount"></el-input>
        </el-form-item>
        <el-form-item label="抹平状态" prop="balanceStatus">
          <el-switch v-model="addCheckForm.balanceStatus" :active-value="1" :inactive-value="0" active-text="已抹平" inactive-text="未抹平"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addCheckForm.remark"></el-input>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="addCheck('addCheckForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <material-dialog 
      :showDialog = showMaterialDialog 
      materialsType = 'single'
      @addMaterial="addMaterial" 
      @close="closeMaterialDialog"></material-dialog>

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
      showMaterialDialog: false,
      showAddCheckDialog: false,
      editType: '添加',
      preRuleForm: null,
      types: [{name: '日结', value: 'DAILY'}, {name: '周结', value: 'WEEKLY'}, {name: '月结', value: 'MONTHLY'}, {name: '其他', value: 'OTHER'}],
      ruleForm: {
        type: 'DAILY',
        remark: '',
        status: 1
      },
      rules: {
        type: [{ required: true, trigger: 'blur' }],
        remark: [{ required: true, trigger: 'blur' }],
        status: [{ required: true, trigger: 'blur' }]
      },
      addCheckForm: {
        materialId: '',
        systemCount: '',
        actualCount: '',
        purchasePrice: '',
        lossCount: '',
        lossAmount: '',
        balanceStatus: 0,
        remark: '' 
      },
      addCheckRules: {
        materialId: [{ required: true, trigger: 'blur' }],
        systemCount: [{ required: true, trigger: 'blur' }],
        actualCount: [{ required: true, trigger: 'blur' }],
        purchasePrice: [{ required: true, trigger: 'blur' }],
        lossCount: [{ required: true, trigger: 'blur' }],
        lossAmount: [{ required: true, trigger: 'blur' }],
        balanceStatus: [{ required: true, trigger: 'blur' }],
        remark: [{ required: true, trigger: 'blur' }] 
      },
      stepStatus: 'progress'
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.editType = '更新'
      this.getTheCheck()
    }
    this.preRuleForm = {...this.ruleForm}
  },
  methods: {
    getTheCheck() {
      stockCheckItemList(this.id).then(res => {
        this.ruleForm = {...res.data}
      })
    },
    addMaterial(materials) {
      console.log('materials', materials)
      this.showMaterialDialog = false
    },
    closeMaterialDialog() {
      this.showMaterialDialog = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm)
          if (this.editType === '添加') {
            params.methodType = 'ADD'
          } else {
            params.methodType = 'UPDATE'            
          }
          handleSupplier(params).then(res => {
            this.$message({
              message: `盘点${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: 'supplier'
            })
          })
        }
      })
    }

  }
}
</script>

<style>
</style>
