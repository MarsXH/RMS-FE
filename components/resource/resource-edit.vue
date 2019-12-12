<template>
  <div class="resource-edit">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      fullscreen>
      <el-form ref="resourceForm" :model="resourceInfo" :disabled="disabled" label-width="90px">
        <el-form-item label="单位名称"><el-input v-model="resourceInfo.company_name" /></el-form-item>
        <el-form-item label="物资名称"><el-input v-model="resourceInfo.resource_name" /></el-form-item>
        <el-form-item label="当前供应商"><el-input v-model="resourceInfo.resource_supplier" /></el-form-item>
        <el-form-item label="型号"><el-input v-model="resourceInfo.resource_model" /></el-form-item>
        <el-form-item label="存量"><el-input v-model="resourceInfo.resource_stock" /></el-form-item>
        <el-form-item label="欠缺量"><el-input v-model="resourceInfo.resource_ullage" /></el-form-item>
        <el-form-item label="收料人"><el-input v-model="resourceInfo.resource_addressee" /></el-form-item>
        <el-form-item label="发料人"><el-input v-model="resourceInfo.resource_addresser" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="mode !== 'read'" @click="saveResource" type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editDialogVisible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    resource: { type: Object, default: () => { return {} } }
  },
  data () {
    return {
      title: '新增物资',
      resourceInfo: {},
      disabled: false
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.editDialogVisible
      },
      set (v) {
        this.$emit('update:editDialogVisible', v)
      }
    }
  },
  mounted () {
    if (this.mode === 'add') {
      this.title = '新增物资'
    } else if (this.mode === 'edit') {
      this.title = '编辑物资'
      this.resourceInfo = this.resource
    } else if (this.mode === 'read') {
      this.title = '查看物资'
      this.resourceInfo = this.resource
      this.disabled = true
    }
  },
  methods: {
    saveResource () {
      this.dialogVisible = false
    }
  }
}
</script>
