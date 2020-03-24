<template>
  <div class="people-table">
    <div>
      <div class="d-flex justify-space-between mb-2">
        <el-row class="mr-1">
          <base-search-input :keyword.sync="string" @search="page = 1;getPeopleList()" placeholder="搜索人名" />
        </el-row>
        <el-button v-if="isAdmin" @click="goDetail('add')" type="info" size="small">新增人员</el-button>
      </div>
    </div>
    <el-table
      :data="peopleList"
      border
      style="width: 100%">
      <el-table-column prop="people_id" label="人员ID" width="70" />
      <el-table-column prop="people_name" label="人名" width="90" />
      <el-table-column prop="company_name" label="单位名称" width="150" />
      <el-table-column prop="department_name" label="部门" width="150" />
      <el-table-column prop="people_age" label="年龄" width="50" />
      <el-table-column prop="position_name" label="职位" width="130" />
      <el-table-column prop="people_phone" label="联系电话" width="120" />
      <el-table-column prop="people_address" label="地址" />
      <el-table-column prop="people_speciality" label="特长" width="120" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="goDetail('read', scope.row)" type="primary" icon="el-icon-search" size="small" circle />
          <el-button v-if="isAdmin" @click="goDetail('edit', scope.row)" type="success" icon="el-icon-edit" size="small" circle />
          <el-button v-if="isAdmin" @click="deletePeople(scope.row.people_uuid)" type="danger" icon="el-icon-delete" size="small" circle />
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-end mt-2">
      <el-pagination
        :current-page.sync="page"
        :total="total"
        :page-size.sync="size"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getPeopleList()"
        @current-change="getPeopleList()"
        background
        layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <people-edit v-if="editDialogVisible" :editDialogVisible.sync="editDialogVisible" :mode="mode" :people="people" @updatePeople="getPeopleList" />
  </div>
</template>

<script>
import BaseSearchInput from '~/components/common/base-search-input'
import PeopleEdit from '~/components/people/people-edit'
export default {
  components: {
    BaseSearchInput,
    PeopleEdit
  },
  data () {
    return {
      peopleList: [],
      string: '',
      page: 1,
      size: 10,
      total: 0,
      editDialogVisible: false,
      mode: 'add',
      people: {},
      loading: false
    }
  },
  computed: {
    isAdmin () {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.user_role > 1
      }
      return false
    }
  },
  mounted () {
    this.getPeopleList()
  },
  methods: {
    async getPeopleList () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const params = {
          string: this.string,
          page: this.page,
          size: this.size
        }
        const { data } = await this.$axios.get(`/api/v1/getPeople`, { params })
        if (data.code !== 0) {
          this.peopleList = data.people_list
          this.total = data.total
        } else {
          this.peopleList = []
          this.total = 0
          console.log(data.message)
          this.$message.error('获取人员列表失败！' + data.message)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('获取人员列表失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    goDetail (type, people = null) {
      this.mode = type
      this.people = people || {}
      this.editDialogVisible = true
    },
    deletePeople (peopleUuid) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const { data } = await this.$axios.delete(`/api/v1/deletePeople?people_uuid=${peopleUuid}`)
          if (data.code !== 0) {
            this.getPeopleList()
            this.$message.success('删除人员成功！')
          } else {
            console.log(data.message)
            this.$message.error('删除人员失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('删除人员失败！' + e)
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
