import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";
import { defaultClient as apolloClient } from "./main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
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
    }
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
          console.log(data.getCurrentUser);
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
    signinUser: ({ commit }, payLoad) => {
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payLoad
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          router.go();
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user
  }
});
