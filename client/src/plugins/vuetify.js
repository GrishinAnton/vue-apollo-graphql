import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify, {
  theme: {
    primary: "#3f51b5",
    secondary: "#2196f3",
    accent: "#f44336",
    error: "#9c27b0",
    warning: "#009688",
    info: "#4caf50",
    success: "#03a9f4"
  }
});

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  }
});
