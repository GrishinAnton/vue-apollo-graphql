import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

Vue.config.productionTip = false;

export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const appolloProvider = new VueApollo({ defaultClient });

new Vue({
  provide: appolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
