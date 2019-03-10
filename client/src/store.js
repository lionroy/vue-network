import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { defaultClient as apolloClient } from "./main";

import {
  GET_CURRENT_USER,
  GET_POSTS,
  GET_PROJECTS,
  INFINITE_SCROLL_POSTS,
  INFINITE_SCROLL_PROJECTS,
  GET_USER_POSTS,
  GET_USER_PROJECTS,
  SEARCH_POSTS,
  ADD_POST,
  ADD_PROJECT,
  UPDATE_USER_POST,
  UPDATE_USER_PROJECT,
  DELETE_USER_POST,
  DELETE_USER_PROJECT,
  SIGNIN_USER,
  SIGNUP_USER
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    projects: [],
    userPosts: [],
    userProjects: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setProjects: (state, payload) => {
      state.projects = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setUserProjects: (state, payload) => {
      state.user !== null
        ? (state.user.projects = payload)
        : (state.user.projects = []);
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearSearchResults: state => (state.searchResults = []),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Add user data to state
          commit("setUser", data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getProjects: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_PROJECTS
        })
        .then(({ data }) => {
          commit("setProjects", data.getProjects);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          // console.log(data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getUserProjects: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_PROJECTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserProjects", data.getUserProjects);
          // console.log(data.getUserProjects);
        })
        .catch(err => {
          console.error(err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.error(err));
    },
    // searchProjects: () => {},
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log(data);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addProject: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_PROJECT,
          variables: payload,
          update: (cache, { data: { addProject } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_PROJECTS });
            // Create updated data
            data.getProjects.unshift(addProject);
            // Write updated data back to query
            console.log(data);
            cache.writeQuery({
              query: GET_PROJECTS,
              data
            });
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addProject: {
              __typename: "Project",
              _id: -1,
              ...payload
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_PROJECTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addProject);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserProject: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_PROJECT,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userProjects.findIndex(
            project => project._id === data.updateUserProject._id
          );
          const userProjects = [
            ...state.userProjects.slice(0, index),
            data.updateUserProject,
            ...state.userProjects.slice(index + 1)
          ];
          commit("setUserProjects", userProjects);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserProject: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_PROJECT,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userProjects.findIndex(
            project => project._id === data.deleteUserProject._id
          );
          const userProjects = [
            ...state.userProjects.slice(0, index),
            ...state.userProjects.slice(index + 1)
          ];
          commit("setUserProjects", userProjects);
        })
        .catch(err => {
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go("/profile");
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit("clearUser");
      // remove token in localStorage
      localStorage.setItem("token", "");
      // end session
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages (i.e. profile)
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    projects: state => state.projects,
    userPosts: state => state.userPosts,
    userProjects: state => state.user && state.user.projects,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
