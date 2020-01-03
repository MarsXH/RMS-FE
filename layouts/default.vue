<template>
  <div class="app-default-layout">
    <el-container class="app-container-box">
      <el-header class="d-flex justify-space-between align-center app-header-nav">
        <h1>CMCC-RMS</h1>
        <div />
        <div class="d-flex justify-end align-center">
          <i class="iconfont iconaccount-circle mr-2" />
          {{ $store.state.auth.user.user_name }}
          <el-button @click="logout()" class="logout-btn header-nav-btn ml-2" circle>
            <i class="iconfont iconexit-to-app" />
          </el-button>
        </div>
      </el-header>
      <el-main data-app="true" style="margin-top: 45px;">
        <el-tabs v-model="activeTab" @tab-click="changeTab" type="card">
          <el-tab-pane label="人员管理" name="persion" />
          <el-tab-pane label="物资管理" name="resource" />
        </el-tabs>
        <el-card :style="{ 'min-height': cardMinHeight + 'px' }" class="box-card">
          <nuxt />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data () {
    return {
      activeTab: 'persion',
      cardMinHeight: null
    }
  },
  mounted () {
    this.getTableHeight()
    window.addEventListener('resize', () => { this.getTableHeight() })
  },
  destroyed () {
    window.removeEventListener('resize', () => { this.getTableHeight() })
  },
  methods: {
    getTableHeight () {
      this.cardMinHeight = document.documentElement.clientHeight - 130
    },
    changeTab (tab) {
      const route = tab.name === 'persion' ? '' : tab.name
      this.$router.push('/' + route)
    },
    async logout () {
      await this.$axios.post(`/api/v1/rms/logout`)
      window.location.href = '/login'
    }
  }
}
</script>

<style lang="stylus">
.app-default-layout {
  min-width: 100vh;
  .app-container-box {
    transition: all .1s;
    min-height: 100vh;
    .el-tabs__header.is-top {
      margin-bottom: 0;
    }
  }
  .app-header-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px !important;
    z-index: 100;
    background-color: #f5f5f5;
    transition: all .1s;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  }
  .header-nav-btn {
    border: 0;
    padding: 0;
    background: transparent;
    &:focus {
      background: transparent;
      color: #606266;
    }
    &:hover {
      background: #DCDCDC;
      color: #606266;
    }
  }
  .logout-btn {
    width: 30px;
    height: 30px;
    max-width: 30px;
  }
}
</style>
