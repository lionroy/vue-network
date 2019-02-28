import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit("setLoading", false);
        // add user data to state
        commit("setUser", data.getCurrentUser);
        // console.log(data.getCurrentUser);
      })
      .catch(err => {
        commit("setLoading", false);
        console.error(err);
      })
    },
    getPosts: ({ commit }) => {
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // get data from action to state via mutations
          // commit passes data from actions along to mutations functions
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
/* eslint-disable-next-line */
          console.error(err);
        });
    },

    signinUser: ({ commit }, payload ) => {
      commit('clearError');
      // clear token to prevent errors
      localStorage.setItem('token', '');
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          // to make sure created method runs in main.js - run getCurrentUser and reload
          // console.log(data.signinUser);
          commit("setLoading", true);
          
          router.go();
        })
        .catch(err => {
          commit("setError", err);
/* eslint-disable-next-line */
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in this.state
      commit('clearUser');
      // remove token from local storage
      localStorage.setItem('token', '');
      // end session
      await apolloClient.resetStore();
      // redirect home boot user's from private pages
      router.push('/');
    }
  },

  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  }
});
