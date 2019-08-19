<template>
  <v-container fluid grid-list-xl>

    <!-- Post Cards -->
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover  >
          <v-img :src="post.imageUrl" height="30vh" lazy @click.native="goToPost(post._id)"></v-img>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="showPostCreator = !showPostCreator" icon>
              <v-icon>{{`mdi-chevron-${showPostCreator ? 'up' : 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator Tile -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="post.createdBy.avatar">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="text--primary">{{post.createdBy.username}}</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-thin">Added {{post.createdDate}}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">mdi-information-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>
          </v-slide-y-transition>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="info" @click="showMorePosts">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts() {
      console.log(this.$apollo);
      
      this.pageNum += 1;
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          console.log("previous result", prevResult.infiniteScrollPosts.posts);
          console.log("fetch more result", fetchMoreResult);

          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>