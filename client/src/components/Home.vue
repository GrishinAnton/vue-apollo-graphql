<template>
  <v-container text-center>
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular interminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
    <v-flex xs12>
      <v-carousel v-if="!loading" v-bind="{ 'cycle': true }">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
          @click.native="goToPost(post._id)"
        >
          <h1 class="carousel_title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "home",
  computed: {
    ...mapGetters(["posts", "loading"])
  },
  created() {
    this.hendleGetCarouselPosts();
  },
  methods: {
    hendleGetCarouselPosts() {
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>


<style>
.carousel_title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 5px 5px 0 0;
  padding: 0;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
