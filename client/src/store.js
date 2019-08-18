import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST
} from "./queries";
import { defaultClient as apolloClient } from "./main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payLoad) => {
      state.posts = payLoad;
    },
    setLoading: (state, payLoad) => {
      state.loading = payLoad;
    },
    setUser: (state, payLoad) => {
      state.user = payLoad;
    },
    setError(state, payLoad) {
      state.error = payLoad;
    },
    setAuthError: (state, payLoad) => {
      state.authError = payLoad;
    },
    clearUser: state => (state.user = null),
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
          commit("setUser", data.getCurrentUser);
        })
        .catch(err => {
          console.log(err);
          commit("setLoading", false);
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
          console.log(err);
          commit("setLoading", false);
        });
    },
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
          }
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    signinUser: ({ commit }, payLoad) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payLoad
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit("setError", err);
          commit("setLoading", false);
          // console.log(err);
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
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          // console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      commit("clearUser");
      localStorage.setItem("token", "");
      await apolloClient.cache.reset();
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
