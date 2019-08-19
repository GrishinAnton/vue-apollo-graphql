<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">mdi-heart</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>mdi-chevron-down</v-icon>
          </v-card-title>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-img @click="toggleImageDialog" :src="getPost.imageUrl" id="post__image"></v-img>
            </template>
            <span>Click to enlarge image</span>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleAddPostMessage"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="messageRules"
                  v-model="messageBody"
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  label="Add Message"
                  type="text"
                  @click:append-outer="handleAddPostMessage"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-item avatar inset :key="message.title">
                <v-list-item-avatar>
                  <img :src="message.messageUser.avatar" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{message.messageBody}}</v-list-item-title>
                  <v-list-item-sub-title>
                    {{message.messageUser.username}}
                    <span
                      class="grey--text text--lighten-1 hidden-xs-only"
                    >{{message.messageDate}}</span>
                  </v-list-item-sub-title>
                </v-list-item-content>

                <v-list-item-action class="hidden-xs-only">
                  <v-icon color="grey">mdi-chat_bubble</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_POST, ADD_POST_MESSAGE } from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "Message is required",
        message =>
          message.length < 75 || "Message must be less than 75 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>