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
  logout ({ commit }, params) {
    commit('setUser', {})
    deleteCookie('authorization')
  },
  async validate ({ commit, dispatch }, params) {
    try {
      const { data } = await this.$axios.post(`/api/v1/validate`, params)
      commit('setUser', data.user)
    } catch (e) {
      console.log(e)
      await dispatch('logout')
    }
  }
}
