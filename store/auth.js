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
  async login ({ commit, dispatch }, params) {
    try {
      const { data } = await this.$axios.post(`/api/v1/login`, params)
      commit('setUser', data.user)
    } catch (e) {
      console.log(e)
      await dispatch('logout')
      throw e
    }
  },
  async logout ({ commit }) {
    try {
      await this.$axios.post(`/api/v1/logout`)
      commit('setUser', {})
      deleteCookie('authorization')
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  async validateToken ({ commit, dispatch }) {
    try {
      const { data } = await this.$axios.post(`/api/v1/validateToken`)
      commit('setUser', data)
    } catch (e) {
      console.log(e)
    }
  }
}
