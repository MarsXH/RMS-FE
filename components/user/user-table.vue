<template>
  <div class="user-table">
    <div>
      <div class="d-flex justify-space-between mb-2">
        <el-row class="mr-1">
          <base-search-input :keyword.sync="string" @search="page = 1;getUserList()" placeholder="搜索用户名称" />
        </el-row>
        <el-button v-if="isSuperAdmin" @click="goDetail('add')" type="info" size="small">新增用户</el-button>
      </div>
    </div>
    <el-table
      :data="userList"
      border
      style="width: 100%">
      <el-table-column prop="user_id" label="用户ID" width="80" />
      <el-table-column prop="user_name" label="用户名称" min-width="150" />
      <el-table-column prop="user_created" label="创建时间" min-width="170">
        <template slot-scope="scope">
          <div>
            {{ FormatDate(scope.row.user_created) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user_updated" label="更新时间" min-width="170">
        <template slot-scope="scope">
          <div>
            {{ FormatDate(scope.row.user_updated) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user_role" label="用户权限">
        <template slot-scope="scope">
          <div>
            {{ scope.row.user_role | formatRole }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="goDetail('read', scope.row)" type="primary" icon="el-icon-search" size="small" circle />
          <el-button v-if="isSuperAdmin" @click="goDetail('edit', scope.row)" type="success" icon="el-icon-edit" size="small" circle />
          <el-button v-if="isSuperAdmin" @click="deleteUser(scope.row.user_uuid)" type="danger" icon="el-icon-delete" size="small" circle />
          <el-button @click="resetPassword(scope.row)" type="danger" size="mini">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-end mt-2">
      <el-pagination
        :current-page.sync="page"
        :total="total"
        :page-size.sync="size"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getUserList()"
        @current-change="getUserList()"
        background
        layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <user-edit v-if="editDialogVisible" :editDialogVisible.sync="editDialogVisible" :mode="mode" :user="user" @updateUser="getUserList()" />
  </div>
</template>

<script>
import { FormatDate } from '~/utils/utils'
import BaseSearchInput from '~/components/common/base-search-input'
import UserEdit from '~/components/user/user-edit'
export default {
  components: {
    BaseSearchInput,
    UserEdit
  },
  filters: {
    formatRole (role) {
      // 0: 账户锁定(无权限) 1: 普通用户 2: admin 3: superadmin
      const roleMap = ['账户锁定', '普通用户', '管理员', '超级管理员']
      return roleMap[role]
    }
  },
  data () {
    return {
      userList: [],
      string: '',
      page: 1,
      size: 10,
      total: 0,
      editDialogVisible: false,
      mode: 'add',
      user: {},
      loading: false
    }
  },
  computed: {
    isSuperAdmin () {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.user_role > 2
      }
      return false
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    FormatDate,
    async getUserList () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        // this.userList = [
        //   {
        //     user_name: '钢管',
        //     user_id: '111',
        //     user_created: 'RMS开发运维部',
        //     user_updated: 'ISIIDSSSS-90-SDD',
        //     user_role: '10000'
        //   }
        // ]
        const params = {
          string: this.string,
          page: this.page,
          size: this.size
        }
        const { data } = await this.$axios.get(`/api/v1/getUser`, { params })
        if (data.code !== 0) {
          this.userList = data.user_list
          this.total = data.total
        } else {
          this.userList = []
          this.total = 0
          console.log(data.message)
          this.$message.error('获取用户列表失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('获取用户列表失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    goDetail (type, user = null) {
      this.mode = type
      this.user = user || {}
      this.editDialogVisible = true
    },
    deleteUser (userUuid) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const { data } = await this.$axios.delete(`/api/v1/deleteUser?user_uuid=${userUuid}`)
          if (data.code !== 0) {
            this.getUserList()
            this.$message.success('删除用户成功！')
          } else {
            console.log(data.message)
            this.$message.error('删除用户失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('删除用户失败！' + e)
        } finally {
          if (this.loading) {
            this.loading.close()
            this.loading = false
          }
        }
      }).catch(() => {})
    },
    resetPassword (userInfo) {
      this.$confirm('此操作将重置该用户密码为 "123456" , 是否继续?', '提示', {
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
            user_uuid: userInfo.user_uuid,
            user_name: userInfo.user_name,
            user_role: userInfo.user_role,
            user_password: '123456'
          }
          const { data } = await this.$axios.post(`/api/v1/changeUserInfo`, params)
          if (data.code !== 0) {
            this.$message.success('重置密码成功！')
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
