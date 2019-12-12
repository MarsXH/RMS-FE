<template>
  <div class="person-edit">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      fullscreen>
      <el-form ref="form" :model="personInfo" :disabled="disabled" label-width="80px">
        <el-form-item label="单位名称"><el-input v-model="personInfo.company_name" /></el-form-item>
        <el-form-item label="人名"><el-input v-model="personInfo.user_name" /></el-form-item>
        <el-form-item label="部门"><el-input v-model="personInfo.department_name" /></el-form-item>
        <el-form-item label="年龄"><el-input v-model="personInfo.user_age" /></el-form-item>
        <el-form-item label="职位"><el-input v-model="personInfo.position_name" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="personInfo.user_phone" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="personInfo.user_address" /></el-form-item>
        <el-form-item label="特长"><el-input v-model="personInfo.user_speciality" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="mode !== 'read'" @click="savePerson" type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editDialogVisible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    person: { type: Object, default: () => { return {} } }
  },
  data () {
    return {
      title: '新增人员',
      personInfo: {},
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
      this.title = '新增人员'
    } else if (this.mode === 'edit') {
      this.title = '编辑人员'
      this.personInfo = this.person
    } else if (this.mode === 'read') {
      this.title = '查看人员'
      this.personInfo = this.person
      this.disabled = true
    }
  },
  methods: {
    savePerson () {
      this.dialogVisible = false
    }
  }
}
</script>
