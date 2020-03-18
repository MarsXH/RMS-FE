<template>
  <div class="people-edit">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      fullscreen>
      <el-form ref="form" :model="peopleInfo" :disabled="disabled" label-width="80px">
        <el-form-item v-if="mode !== 'add'" label="人员ID"><el-input v-model="peopleInfo.people_id" :disabled="true" /></el-form-item>
        <el-form-item label="单位名称"><el-input v-model="peopleInfo.company_name" /></el-form-item>
        <el-form-item label="人名"><el-input v-model="peopleInfo.people_name" /></el-form-item>
        <el-form-item label="部门"><el-input v-model="peopleInfo.department_name" /></el-form-item>
        <el-form-item label="年龄"><el-input v-model="peopleInfo.people_age" /></el-form-item>
        <el-form-item label="职位"><el-input v-model="peopleInfo.position_name" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="peopleInfo.people_phone" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="peopleInfo.people_address" /></el-form-item>
        <el-form-item label="特长"><el-input v-model="peopleInfo.people_speciality" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="mode !== 'read'" @click="beforeSave()" type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editDialogVisible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    people: { type: Object, default: () => { return {} } }
  },
  data () {
    return {
      title: '新增人员',
      peopleInfo: {},
      disabled: false,
      loading: false
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
      this.peopleInfo = this.people
    } else if (this.mode === 'read') {
      this.title = '查看人员'
      this.peopleInfo = this.people
      this.disabled = true
    }
  },
  methods: {
    beforeSave () {
      if (this.mode === 'add') {
        this.addPeople()
      } else if (this.mode === 'edit') {
        this.updatePeople()
      }
    },
    async addPeople () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const { data } = await this.$axios.post(`/api/v1/addPeople`, this.peopleInfo)
        if (data.code !== 0) {
          this.$emit('updatePeople')
          this.dialogVisible = false
          this.$message.success('新增人员成功！')
        } else {
          console.log(data.message)
          this.$message.error('新增人员失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('新增人员失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    async updatePeople () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const params = {
          people_uuid: this.peopleInfo.people_uuid,
          people_info: this.peopleInfo
        }
        const { data } = await this.$axios.put(`/api/v1/updatePeople`, params)
        if (data.code !== 0) {
          this.$emit('updatePeople')
          this.dialogVisible = false
          this.$message.success('更新人员成功！')
        } else {
          console.log(data.message)
          this.$message.error('更新人员失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('更新人员失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    }
  }
}
</script>
