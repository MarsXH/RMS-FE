<template>
  <div class="personal-edit">
    <el-tabs tab-position="left">
      <el-tab-pane label="基础信息">
        <el-form ref="baseForm" :model="baseInfo" label-width="90px">
          <el-form-item label="用户ID"><el-input v-model="baseInfo.user_id" :disabled="true" /></el-form-item>
          <el-form-item label="用户名称"><el-input v-model="baseInfo.user_name" /></el-form-item>
          <el-form-item label="创建时间"><el-input :value="FormatDate(baseInfo.user_created)" :disabled="true" /></el-form-item>
        </el-form>
        <el-button @click="changeUsername()" type="primary">保 存</el-button>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-form ref="passwordForm" :model="passwordInfo" label-width="90px">
          <el-form-item label="原密码"><el-input v-model="passwordInfo.user_password" /></el-form-item>
          <el-form-item label="新密码"><el-input v-model="passwordInfo.new_user_password" /></el-form-item>
        </el-form>
        <el-button @click="changePassword()" type="primary">保 存</el-button>
      </el-tab-pane>
      <el-tab-pane label="重置密码">
        <el-button @click="resetPassword()" type="danger">重 置</el-button>
        <span>(重置密码为123456)</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { DeepClone, FormatDate } from '~/utils/utils'

export default {
  data () {
    return {
      baseInfo: {},
      passwordInfo: {
        user_password: '',
        new_user_password: ''
      },
      loading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    this.baseInfo = DeepClone(this.userInfo)
  },
  methods: {
    FormatDate,
    changeUsername () {
      this.$confirm('确认要修改用户名 ? 修改后请重新登录。', '提示', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const params = {
            is_change_username: true,
            user_uuid: this.userInfo.user_uuid,
            user_name: this.baseInfo.user_name
          }
          const { data } = await this.$axios.post(`/api/v1/changeUserInfo`, params)
          if (data.code !== 0) {
            this.$message.success('修改用户名成功！请重新登录。')
            await this.$store.dispatch('auth/logout')
          } else {
            console.log(data.message)
            this.$message.error('修改用户名失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('修改用户名失败！' + e)
        } finally {
          if (this.loading) {
            this.loading.close()
            this.loading = false
          }
        }
      }).catch(() => {})
    },
    changePassword () {
      this.$confirm('确认要修改密码 ? 修改后请重新登录。', '提示', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const params = {
            is_change_password: true,
            user_uuid: this.userInfo.user_uuid,
            user_name: this.userInfo.user_name,
            user_password: this.passwordInfo.user_password,
            new_user_password: this.passwordInfo.new_user_password
          }
          const { data } = await this.$axios.post(`/api/v1/changeUserInfo`, params)
          if (data.code !== 0) {
            this.$message.success('修改密码成功！请重新登录。')
            await this.$store.dispatch('auth/logout')
          } else {
            console.log(data.message)
            this.$message.error('修改密码失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('修改密码失败！' + e)
        } finally {
          if (this.loading) {
            this.loading.close()
            this.loading = false
          }
        }
      }).catch(() => {})
    },
    resetPassword () {
      this.$confirm('此操作将重置密码为 "123456" , 是否继续? 重置后请重新登录。', '提示', {
        confirmButtonText: '重置',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const params = {
            is_reset_password: true,
            user_uuid: this.userInfo.user_uuid,
            user_name: this.userInfo.user_name,
            user_password: '123456'
          }
          const { data } = await this.$axios.post(`/api/v1/changeUserInfo`, params)
          if (data.code !== 0) {
            this.$message.success('重置密码成功！请重新登录。')
            await this.$store.dispatch('auth/logout')
          } else {
            console.log(data.message)
            this.$message.error('重置密码失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('重置密码失败！' + e)
        } finally {
          if (this.loading) {
            this.loading.close()
            this.loading = false
          }
        }
      }).catch(() => {})
    }
  }
}
</script>
