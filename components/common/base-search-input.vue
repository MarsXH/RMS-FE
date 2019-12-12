<template>
  <div class="base-search">
    <el-input
      v-model="input"
      :placeholder="placeholder"
      :size="size"
      @keyup.enter.native="search">
      <template slot="append">
        <el-button :disabled="!isChanged || input === oldKeyword" @click="search" type="primary" icon="el-icon-search" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    keyword: { type: String, default: '' },
    size: { type: String, default: 'small' },
    placeholder: { type: String, default: 'Search' }
  },
  data () {
    return {
      isChanged: false,
      oldKeyword: ''
    }
  },
  computed: {
    input: {
      get () {
        return this.keyword
      },
      set (v) {
        if (!this.isChanged) this.isChanged = true
        this.$emit('update:keyword', v)
      }
    }
  },
  methods: {
    search () {
      if (this.oldKeyword !== this.input) {
        this.oldKeyword = this.input
        this.$emit('search')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.base-search {
  >>> .el-input-group__append {
    border: 0;
    .el-button {
      color: #FFF;
      background-color: #409EFF;
      border: 0;
      border-radius: 0 5px 5px 0;
      padding: 10px 15px;
    }
    .el-button.el-button--primary.is-disabled {
      color: #FFF;
      background-color: #a0cfff;
      border-color: #a0cfff;
    }
  }
}
</style>
