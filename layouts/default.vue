<template>
  <div class="app-default-layout">
    <el-container class="app-container-box">
      <el-header class="d-flex justify-space-between align-center app-header-nav">
        <img src="~/assets/img/logo.png" class="logo" alt="中铁北京局（天津）公司人力资源管理系统">
        <p class="title">人力资源管理系统</p>
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
          <el-tab-pane label="个人中心" name="personal" />
          <el-tab-pane v-if="$store.state.auth.user.user_role > 2" label="系统用户管理" name="user" />
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
  watch: {
    '$route' () {
      this.activeTab = (!this.$route.name || this.$route.name === 'index') ? 'persion' : this.$route.name
    }
  },
  mounted () {
    this.getTableHeight()
    window.addEventListener('resize', () => { this.getTableHeight() })
    if (this.$route.path.match(/personal/)) this.activeTab = 'personal'
    else if (this.$route.path.match(/resource/)) this.activeTab = 'resource'
    else if (this.$route.path.match(/user/)) this.activeTab = 'user'
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
      try {
        const data = await this.$store.dispatch('auth/logout')
        if (data.code !== 0) {
          this.$message.error('退出成功！请重新登录。')
        } else {
          console.log(data.message)
          this.$message.error('退出失败！' + data.message)
        }
      } catch (error) {
        console.log(error, 'error')
        this.status = 'error'
        this.alertTitle = '服务器错误，请联系管理员。'
      }
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
    .title {
      line-height: 40px;
      font-size: 20px;
      font-weight: 900;
      margin-right: 160px;
      color: #555555;
    }
    .logo {
      height: 40px;
      vertical-align: middle;
    }
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
