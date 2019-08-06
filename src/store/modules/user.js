import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setGuid, getGuid } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  guid: getGuid(),
  permission: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_GUID: (state, guid) => {
    state.guid = guid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ telephone: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.backendToken)
        commit('SET_NAME', data.staff.name)
        commit('SET_GUID', data.staff.id)
        commit('SET_PERMISSION', data.staff.role.permissions)
        setToken(data.backendToken)
        setGuid(data.staff.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.guid).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_NAME', data.name)
        commit('SET_PERMISSION', data.role.permissionIds.split(',').map(item => +item))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

