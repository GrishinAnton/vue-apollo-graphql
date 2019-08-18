import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

Vue.config.productionTip = false;

export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("networkError");
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === "AuthenticationError") {
          store.commit("setAuthError", err);
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const appolloProvider = new VueApollo({ defaultClient });

new Vue({
  provide: appolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
