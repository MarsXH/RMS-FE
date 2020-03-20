<template>
  <div class="resource-table">
    <div>
      <div class="d-flex justify-space-between mb-2">
        <el-row class="mr-1">
          <base-search-input :keyword.sync="string" @search="page = 1;getResourceList()" placeholder="搜索物资名称" />
        </el-row>
        <el-button v-if="isAdmin" @click="goDetail('add')" type="info" size="small">新增物资</el-button>
      </div>
    </div>
    <el-table
      :data="resourceList"
      border
      style="width: 100%">
      <el-table-column prop="resource_id" label="物资ID" width="70" />
      <el-table-column prop="resource_name" label="物资名称" />
      <el-table-column prop="company_name" label="单位名称" />
      <el-table-column prop="resource_supplier" label="当前供应商" />
      <el-table-column prop="resource_model" label="型号" width="150" />
      <el-table-column prop="resource_stock" label="存量" width="90" />
      <el-table-column prop="resource_ullage" label="欠缺量" width="90" />
      <el-table-column prop="resource_addressee" label="收料人" width="90" />
      <el-table-column prop="resource_addresser" label="发料人" width="90" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="goDetail('read', scope.row)" type="primary" icon="el-icon-search" size="small" circle />
          <el-button v-if="isAdmin" @click="goDetail('edit', scope.row)" type="success" icon="el-icon-edit" size="small" circle />
          <el-button v-if="isAdmin" @click="deleteResource(scope.row.resource_uuid)" type="danger" icon="el-icon-delete" size="small" circle />
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-end mt-2">
      <el-pagination
        :current-page.sync="page"
        :total="total"
        :page-size.sync="size"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getResourceList()"
        @current-change="getResourceList()"
        background
        layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <resource-edit v-if="editDialogVisible" :editDialogVisible.sync="editDialogVisible" :mode="mode" :resource="resource" @updateResource="getResourceList()" />
  </div>
</template>

<script>
import BaseSearchInput from '~/components/common/base-search-input'
import ResourceEdit from '~/components/resource/resource-edit'
export default {
  components: {
    BaseSearchInput,
    ResourceEdit
  },
  data () {
    return {
      resourceList: [],
      string: '',
      page: 1,
      size: 10,
      total: 0,
      editDialogVisible: false,
      mode: 'add',
      resource: {},
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
    this.getResourceList()
  },
  methods: {
    async getResourceList () {
      try {
        if (!this.loading) {
          this.loading = this.$loading()
        }
        const params = {
          string: this.string,
          page: this.page,
          size: this.size
        }
        const { data } = await this.$axios.get(`/api/v1/getResource`, { params })
        if (data.code !== 0) {
          this.resourceList = data.resource_list
          this.total = data.total
        } else {
          this.resourceList = []
          this.total = 0
          console.log(data.message)
          this.$message.error('获取资源列表失败！' + data.message)
        }
        // this.resourceList = [
        //   {
        //     resource_name: '钢管',
        //     company_name: '中国移动上海分公司',
        //     resource_supplier: 'RMS开发运维部',
        //     resource_model: 'ISIIDSSSS-90-SDD',
        //     resource_stock: '10000',
        //     resource_ullage: '10000',
        //     resource_addressee: '张兴华1号',
        //     resource_addresser: '张兴华2号'
        //   }
        // ]
      } catch (e) {
        console.log(e)
        this.$message.error('获取资源列表失败！' + e)
      } finally {
        if (this.loading) {
          this.loading.close()
          this.loading = false
        }
      }
    },
    goDetail (type, resource = null) {
      this.mode = type
      this.resource = resource || {}
      this.editDialogVisible = true
    },
    deleteResource (resourceUuid) {
      this.$confirm('此操作将永久删除该物资, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (!this.loading) {
            this.loading = this.$loading()
          }
          const { data } = await this.$axios.delete(`/api/v1/deleteResource?resource_uuid=${resourceUuid}`)
          if (data.code !== 0) {
            this.getResourceList()
            this.$message.success('删除资源成功！')
          } else {
            console.log(data.message)
            this.$message.error('删除资源失败！' + data.message)
          }
        } catch (e) {
          console.log(e)
          this.$message.error('删除资源失败！' + e)
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
