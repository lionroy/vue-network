<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog
        v-model="loading"
        persistant
        fullscreen
      >
        <v-container fill-height>
          <v-layout
            row
            justify-center
            align-center
          >
            <v-progress-circular
              intermediate
              :size="70"
              :width="7"
              color="secondary"
            ></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-flex xs12>
      <v-carousel id="carousella"
        v-if="!loading && posts.length > 0"
        v-bind="{ 'cycle': true }"
        interval="3000"
      >
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <v-content
            flex
            class="carousel__item"
          >
            <h1 id="carousel__title">{{post.title}}</h1>
            
            <p>{{post._id}}</p>
          </v-content>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
/* eslint-disable-next-line */
import { mapGetters } from "vuex";

export default {
  name: "home",
  created() {
    this.handleGetCarouselPosts();
  },
  computed: {
    ...mapGetters(["loading", "posts"])
  },
  methods: {
    handleGetCarouselPosts() {
      // reach out to store. fire action. fetch posts for carousel
      this.$store.dispatch("getPosts");
    }
  }
};
</script>

<style>
#carousella {
  filter: drop-shadow(1px 5px 1px rgba(87, 11, 94, 0.7));
}
#carousel__title {
  font-family: "Permanent Marker", cursive;
  position: absolute;
  background-color: rgba(87, 11, 94, 0.7);
  color: whitesmoke;
  border-radius: 3px 3px 0 0;
  padding: 0.5em;
  letter-spacing: .2em;
  margin: 0 auto;
  bottom: 40px;
  left: 0;
  right: 0;
}
.carousel__item {
  font-family: "Exo", sans-serif;
  position: absolute;
  background-color: rgba(87, 11, 94, 0.7);
  color: white;
  font-size: 1.2em;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
.rosso {
  color: orangered;
}
.cursivo {
  font-family: "Dancing Script", cursive;
}
.profondo {
  font-family: "Permanent Marker", cursive;
}
</style>
