<template>
  <v-app style="background: #E3E3EE">
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider> 

      <v-list-item-group shaped>
        <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-icon>
            <v-icon>mdi-door</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>SingOut</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-item-group>

    </v-navigation-drawer>

    <v-toolbar fixed color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">VueShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        flex
        prepend-icon="mdi-search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        
        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only">mdi-account</v-icon>
          <v-badge right color="blue darken-2">
            <!-- <span slot="badge">1</span> -->
            Profile
          </v-badge>
        </v-btn>

        <v-btn text v-if="user" @click="handleSignoutUser">
          <v-icon left class="hidden-sm-only">mdi-door</v-icon>
          Singout
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>

    <main style="flex-basis: 100%">
      <v-container class="mt-4">
        <transition name="fade">
          <router-view/>
        </transition>
        
        <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" buttom left>
          <v-icon>mdi-check</v-icon>
          <h3>You are signed in!</h3>
        </v-snackbar>

        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="info" :timeout="5000" buttom left>
          <v-icon>mdi-cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false
    };
  },
  watch: {
    user(newValue, oldValue){     
      console.log(newValue, 'newValue');
      console.log(oldValue, 'oldValue');
      
      if(oldValue === null) {
        this.authSnackbar = true
      }
    },
    authError(value){
      if(value !== null) {
        this.authErrorSnackbar = true
      }
    },
  },  
  computed: {
    ...mapGetters(['authError', 'user']),
    horizontalNavItems() {
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-spotify", title: "Sing In", link: "/signin" },
        { icon: "mdi-account", title: "Sing Up", link: "/signup" }
      ];
      if(this.user){
        items = [
          { icon: "mdi-chat", title: "Posts", link: "/posts" },
        ]
      }
      return items

    },
    sideNavItems(){
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-spotify", title: "Sing In", link: "/signin" },
        { icon: "mdi-account", title: "Sing Up", link: "/signup" }
      ];
      if(this.user){
        items = [
          { icon: "mdi-chat", title: "Posts", link: "/posts" },
          { icon: "mdi-star", title: "Create Posts", link: "/post/add" },
          { icon: "mdi-account", title: "Profile", link: "/profile" },
        ]
      }
      return items      
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>