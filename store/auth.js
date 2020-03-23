import Vue from 'vue'
import Vuex from 'vuex'
import { deleteCookie } from '~/utils/cache'

Vue.use(Vuex)

export const state = () => ({
  user: {}
})

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  login ({ commit, dispatch }, params) {
    return new Promise(async resolve => {
      const { data } = await this.$axios.post(`/api/v1/login`, params)
      if (data.code !== 0) {
        commit('setUser', data.user)
      }
      resolve(data)
    })
  },
  logout ({ commit }) {
    return new Promise(async resolve => {
      const { data } = await this.$axios.post(`/api/v1/logout`)
      commit('setUser', {})
      deleteCookie('authorization')
      window.location.href = '/login'
      resolve(data)
    })
  },
  async validateToken ({ commit, dispatch }) {
    try {
      const { data } = await this.$axios.post(`/api/v1/validateToken`)
      console.log('validateToken Data', data)
      if (data.code === 0) {
        console.log(data.message)
      } else {
        commit('setUser', data.user)
        console.log('validateToken state', state)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
