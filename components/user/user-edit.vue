<template>
  <div class="user-edit">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      fullscreen>
      <el-form ref="userForm" :model="userInfo" :disabled="disabled" label-width="90px">
        <el-form-item v-if="mode !== 'add'" label="用户ID"><el-input v-model="userInfo.user_id" :disabled="true" /></el-form-item>
        <el-form-item label="用户名称"><el-input v-model="userInfo.user_name" /></el-form-item>
        <el-form-item label="用户权限">
          <el-select v-model="userInfo.user_role">
            <el-option :value="0" label="冻结账户" />
            <el-option :value="1" label="普通用户" />
            <el-option :value="2" label="管理员" />
            <el-option :value="3" label="超级管理员" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="mode !== 'add'" label="创建时间"><el-input :value="FormatDate(userInfo.user_created)" :disabled="true" /></el-form-item>
        <el-form-item v-if="mode !== 'add'" label="更新时间"><el-input :value="FormatDate(userInfo.user_updated)" :disabled="true" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="mode !== 'read'" @click="beforeSave()" type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { FormatDate } from '~/utils/utils'
export default {
  props: {
    editDialogVisible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    user: { type: Object, default: () => { return {} } }
  },
  data () {
    return {
      title: '新增用户',
      userInfo: {},
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
      this.title = '新增用户'
    } else if (this.mode === 'edit') {
      this.title = '编辑用户'
      this.userInfo = this.user
    } else if (this.mode === 'read') {
      this.title = '查看用户'
      this.userInfo = this.user
      this.disabled = true
    }
  },
  methods: {
    FormatDate,
    beforeSave () {
      if (this.mode === 'add') {
        this.addUser()
      } else if (this.mode === 'edit') {
        this.updateUser()
      }
    },
    async addUser () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const { data } = await this.$axios.post(`/api/v1/register`, this.userInfo)
        if (data.code !== 0) {
          this.$emit('updateUser')
          this.dialogVisible = false
          this.$message.success('新增用户成功！')
        } else {
          console.log(data.message)
          this.$message.error('新增用户失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('新增用户失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    async updateUser () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const params = {
          is_change_username: true,
          user_uuid: this.userInfo.user_uuid,
          user_name: this.userInfo.user_name,
          user_role: this.userInfo.user_role
        }
        const { data } = await this.$axios.post(`/api/v1/changeUserInfo`, params)
        if (data.code !== 0) {
          this.$emit('updateUser')
          this.dialogVisible = false
          this.$message.success('更新用户成功！')
        } else {
          console.log(data.message)
          this.$message.error('更新用户失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('更新用户失败！' + e)
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
