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
      <el-table-column prop="user_name" label="人名" width="90" />
      <el-table-column prop="department_name" label="部门" />
      <el-table-column prop="user_age" label="年龄" width="50" />
      <el-table-column prop="position_name" label="职位" />
      <el-table-column prop="user_phone" label="联系电话" width="120" />
      <el-table-column prop="user_address" label="地址" />
      <el-table-column prop="user_speciality" label="特长" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="goDetail('read', scope.row)" type="primary" icon="el-icon-search" size="small" circle />
          <el-button v-if="isAdmin" @click="goDetail('edit', scope.row)" type="success" icon="el-icon-edit" size="small" circle />
          <el-button v-if="isAdmin" @click="deletePerson(scope.row.user_uuid)" type="danger" icon="el-icon-delete" size="small" circle />
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
      person: {}
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
    getPersonList () {
      this.personList = [
        {
          company_name: '中国移动上海分公司',
          user_name: '张兴华呀',
          department_name: 'RMS开发运维部',
          user_age: '28',
          position_name: '前端开发工程师',
          user_phone: '18846134496',
          user_address: '黑龙江省哈尔滨市巴彦县道外区红旗大街999号黑龙江工程学院',
          user_speciality: '踢足球'
        }
      ]
    },
    goDetail (type, person = null) {
      this.mode = type
      this.person = person || {}
      this.editDialogVisible = true
    },
    deletePerson (userUuid) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
      console.log(userUuid)
    }
  }
}
</script>
