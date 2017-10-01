import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

// Polyfill for window.fetch()
require('whatwg-fetch');

const store = () => new Vuex.Store({

    state: {
        authUser: null,
        gifURL: null
    },

    mutations: {
        SET_USER: function(state, user) {
            state.authUser = user
        }
    },

    actions: {
        nuxtServerInit({ commit }, { req }) {
            if (req.session && req.session.authUser) {
                commit('SET_USER', req.session.authUser)
            }
        },
        login({ commit }, { username, password }) {
            return fetch('/api/login', {
                    // Send the client cookies to the server
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then((res) => {
                    if (res.status === 401) {
                        throw new Error('Bad credentials.')
                    } else {
                        return res.json()
                    }
                })
                .then((authUser) => {
                    commit('SET_USER', authUser)
                })
        },
        register({ commit }, { username, password, passconf, email, code }) {
            return fetch('/api/register', {
                    // Send the client cookies to the server
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then((res) => {
                    if (res.status === 401) {
                        throw new Error('An account with that username already exists.')
                    } else {
                        return res.json()
                    }
                })
                .then((authUser) => {
                    commit('SET_USER', authUser)
                })
        },
        logout({ commit }) {
            return fetch('/api/logout', {
                    // Send the client cookies to the server
                    credentials: 'same-origin',
                    method: 'POST'
                })
                .then(() => {
                    commit('SET_USER', null)
                })
        }

    }

})


export default store;