import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home";
import AddPost from "./components/Posts/AddPost";
import Posts from "./components/Posts/Posts";

import Profile from "./components/Auth/Profile";
import Singin from "./components/Auth/Singin";
import Singup from "./components/Auth/Singup";

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/post/add",
      name: "AddPost",
      component: AddPost
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "/singin",
      name: "Singin",
      component: Singin
    },
    {
      path: "/singup",
      name: "Singup",
      component: Singup
    }
  ]
});
