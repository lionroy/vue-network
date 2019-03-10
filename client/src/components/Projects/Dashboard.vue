<template>
  <v-layout>

    <v-container
      grid-list-md
      text-xs-center
      fluid
    >

      <v-layout
        class="mt-2 mb-3"
        row
        wrap
        v-if="!loading"
      >

      </v-layout>
      <v-layout row>
        <v-dialog
          v-model="loading"
          persistent
          fullscreen
        >
          <v-container fill-height>
            <v-layout
              row
              justify-center
              align-center
            >
              <v-progress-circular
                indeterminate
                :size="70"
                :width="7"
                color="secondary"
              ></v-progress-circular>
            </v-layout>
          </v-container>
        </v-dialog>
      </v-layout>

      <!-- Grid Projects -->
  <!-- Carousel Projects -->
    <v-flex xs12>
      <v-card position="relative">
        <v-carousel
          v-if="!loading && projects.length > 0"
          v-bind="{ 'cycle': true }"
          interval="10000"
        >
          <v-carousel-item
            v-for="project in projects"
            :key="project._id"
            :src="project.imageUrl"
            @click.native="goToProject(project._id)"
          >
            <h1 id="carousel__title">{{project.title}}</h1>
          </v-carousel-item>
        </v-carousel>

      </v-card>

    </v-flex>
    </v-container>
  </v-layout>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  created() {
    this.handleGetCarouselProjects();
  },
  computed: {
    ...mapGetters(["loading", "projects"])
  },
  methods: {
    handleGetCarouselProjects() {
      this.$store.dispatch("getProjects");
    },
    goToProject(projectId) {
      this.$router.push(`/dashboard/${projectId}`);
    }
  }
};
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
