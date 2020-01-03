<template>
  <div @keyup.enter="login()" class="container">
    <el-card class="panel">
      <el-form ref="LoginForm" :disabled="LoginForm.disabled" :model="LoginForm" :rules="inputRules" status-icon>
        <el-form-item label="Account" prop="id">
          <el-input v-model="LoginForm.id" />
        </el-form-item>
        <el-form-item label="Password" prop="pass">
          <el-input v-model="LoginForm.pass" type="password" />
        </el-form-item>
        <el-form-item class="text-right">
          <el-button @click="login()" type="primary">Go</el-button>
          <el-button @click="resetForm('LoginForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-alert v-show="status" :type="status === 'processing' ? 'info' : status" :title="alertTitle" class="alert" show-icon />
  </div>
</template>
<script>
export default {
  data () {
    // const validateId = (rule, value, callback) => {
    //   const exp = /(iec|ies|IEC|IES)+([0-9a-zA-Z]){6}$/
    //   if (value === '') { return callback(new Error('Please input the Inventec ID')) }
    //   if (!exp.test(value)) { return callback(new Error('Wrong ID format.')) }
    //   callback()
    // }
    // const validatePass = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('Password too short.'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      alertTitle: '',
      status: '',
      LoginForm: {
        pass: '',
        id: '',
        disabled: false
      },
      inputRules: {
        // pass: [
        //   { validator: validatePass, trigger: 'blur' }
        // ],
        // id: [
        //   { validator: validateId, trigger: 'blur' }
        // ]
      }
    }
  },
  head () {
    return { title: '登录', meta: [{ hid: 'login' }] }
  },
  methods: {
    login () {
      this.$refs.LoginForm.validate(async valid => {
        this.LoginForm.disabled = true
        if (valid) {
          this.status = 'processing'
          this.alertTitle = 'Processing...'
          const credential = { username: this.LoginForm.id, password: this.LoginForm.pass }
          try {
            await this.$store.dispatch('auth/login', credential)
            this.alertTitle = `Nice, it's time to do something special.`
            this.status = 'success'
            this.LoginForm.disabled = false
            this.$router.replace('/')
          } catch (error) {
            console.log(error, 'error')
            this.status = 'error'
            if (error.response) {
              this.alertTitle = error.response.status === 400
                ? `Oops! Account not exists or incorrect password.`
                : error.response.data.message || error.response.data
            } else {
              this.alertTitle = `Oops! Something wrong.`
            }
            this.LoginForm.disabled = false
          }
        } else {
          this.status = 'error'
          this.alertTitle = 'You have to fill in all required items correctly before requesting.'
          this.LoginForm.disabled = false
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this[formName].disabled = false
      this.status = ''
    }
  },
  layout: 'auth'
}
</script>

<style lang="stylus" scoped>
.container
  width 100vw
  height 100vh
  display flex
  justify-content center
  align-items center
  flex-direction column
  .panel,
  .alert
    width 400px
    margin 10px auto
</style>
