<template>
  <div class="person-table">
    <div>
      <div class="d-flex justify-space-between mb-2">
        <el-row class="mr-1">
          <base-search-input :keyword.sync="string" @search="page = 1;getPersonList()" placeholder="搜索人名" />
        </el-row>
        <el-button v-if="isAdmin" @click="goDetail('add')" type="info" size="small">新增人员</el-button>
      </div>
    </div>
    <el-table
      :data="personList"
      border
      style="width: 100%">
      <el-table-column prop="company_name" label="单位名称" />
      <el-table-column prop="person_name" label="人名" width="90" />
      <el-table-column prop="department_name" label="部门" />
      <el-table-column prop="person_age" label="年龄" width="50" />
      <el-table-column prop="position_name" label="职位" />
      <el-table-column prop="person_phone" label="联系电话" width="120" />
      <el-table-column prop="person_address" label="地址" />
      <el-table-column prop="person_speciality" label="特长" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="goDetail('read', scope.row)" type="primary" icon="el-icon-search" size="small" circle />
          <el-button v-if="isAdmin" @click="goDetail('edit', scope.row)" type="success" icon="el-icon-edit" size="small" circle />
          <el-button v-if="isAdmin" @click="deletePerson(scope.row.person_uuid)" type="danger" icon="el-icon-delete" size="small" circle />
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-end mt-2">
      <el-pagination
        :total="total"
        :page-size="size"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getPersonList()"
        @current-change="getPersonList()"
        background
        layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <person-edit v-if="editDialogVisible" :editDialogVisible.sync="editDialogVisible" :mode="mode" :person="person" />
  </div>
</template>

<script>
import BaseSearchInput from '~/components/common/base-search-input'
import PersonEdit from '~/components/person/person-edit'
export default {
  components: {
    BaseSearchInput,
    PersonEdit
  },
  data () {
    return {
      personList: [],
      string: '',
      page: 1,
      size: 10,
      total: 0,
      editDialogVisible: false,
      mode: 'add',
      person: {},
      loading: false
    }
  },
  computed: {
    isAdmin () {
      return true
    }
  },
  mounted () {
    this.getPersonList()
  },
  methods: {
    async getPersonList () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const { data } = await this.$axios.get(`/api/v1/person`)
        this.personList = data
        this.personList = [
          {
            company_name: '中国移动上海分公司',
            person_name: '张兴华呀',
            department_name: 'RMS开发运维部',
            person_age: '28',
            position_name: '前端开发工程师',
            person_phone: '18846134496',
            person_address: '黑龙江省哈尔滨市巴彦县道外区红旗大街999号黑龙江工程学院',
            person_speciality: '踢足球'
          }
        ]
      } catch (e) {
        console.log(e)
        this.$message.error('获取人员列表失败！')
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    goDetail (type, person = null) {
      this.mode = type
      this.person = person || {}
      this.editDialogVisible = true
    },
    deletePerson (personUuid) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          await this.$axios.delete(`/api/v1/deletePerson`, { personUuid })
          this.$message.success('删除人员成功！')
        } catch (e) {
          console.log(e)
          this.$message.error('删除人员失败！')
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
