<template>
  <v-container v-if="getProject" class="mt-3" flexbox center>

    <!-- Project Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getProject.title}}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon large :color="checkIfProjectLiked(getProject._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getProject.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media @click="toggleImageDialog" slot="activator" :src="getProject.imageUrl" id="project__image"></v-card-media>
          </v-tooltip>

          <!-- Project Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="getProject.imageUrl" height="80vh"></v-card-media>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getProject.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="whitesmoke">{{category}}</v-chip>
            </span>
            <h3>{{getProject.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddProjectMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="messageRules" v-model="messageBody" clearable :append-outer-icon="messageBody && 'send'" label="Add Message" type="text" @click:append-outer="handleAddProjectMessage" prepend-icon="email" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Messages ({{getProject.messages.length}})</v-subheader>

            <template v-for="message in getProject.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile avatar inset :key="message.title">
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{message.messageBody}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{getTimeFromNow(message.messageDate)}}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action class='hidden-xs-only'>
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>

              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import {
  GET_PROJECT,
  ADD_PROJECT_MESSAGE,
  LIKE_PROJECT,
  UNLIKE_PROJECT
} from "../../queries";

export default {
  name: "Project",
  props: ["ProjectId"],
  data() {
    return {
      projectLiked: false,
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
    getProject: {
      query: GET_PROJECT,
      variables() {
        return {
          projectId: this.projectId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    checkIfProjectLiked(projectId) {
      // check if user favorites includes project with id of 'projectId'
      if (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === projectId)
      ) {
        this.projectLiked = true;
        return true;
      } else {
        this.projectLiked = false;
        return false;
      }
    },
    handleToggleLike() {
      if (this.projectLiked) {
        this.handleUnlikeProject();
      } else {
        this.handleLikeProject();
      }
    },
    handleLikeProject() {
      const variables = {
        projectId: this.projectId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: LIKE_PROJECT,
          variables,
          update: (cache, { data: { likeProject } }) => {
            const data = cache.readQuery({
              query: GET_PROJECT,
              variables: { projecId: this.projectId }
            });
            data.getProject.likes += 1;
            cache.writeQuery({
              query: GET_PROJECT,
              variables: { projectId: this.projectId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likeProject.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikeProject() {
      const variables = {
        projectId: this.projectId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_PROJECT,
          variables,
          update: (cache, { data: { unlikeProject } }) => {
            const data = cache.readQuery({
              query: GET_PROJECT,
              variables: { projectId: this.projectId }
            });
            data.getProject.likes -= 1;
            cache.writeQuery({
              query: GET_PROJECT,
              variables: { projectId: this.projectId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.unlikeProject.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleAddProjectMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          projectId: this.projectId
        };
        this.$apollo
          .mutate({
            mutation: ADD_PROJECT_MESSAGE,
            variables,
            update: (cache, { data: { addProjectMessage } }) => {
              const data = cache.readQuery({
                query: GET_PROJECT,
                variables: { projectId: this.projectId }
              });
              data.getProject.messages.unshift(addProjectMessage);
              cache.writeQuery({
                query: GET_PROJECT,
                variables: { projectId: this.projectId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addProjectMessage);
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
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    }
  }
};
</script>

<style scoped>
#project__image {
  height: 400px !important;
}
</style>
