<template>
  <v-container fluid grid-list-xl>

    <!-- Project Cards -->
    <v-layout row wrap v-if="infiniteScrollProjects">
      <v-flex xs12 sm6 v-for="project in infiniteScrollProjects.projects" :key="project._id">
        <v-card hover>
          <v-card-media @click.native="goToProject(project._id)" :src="project.imageUrl" height="30vh" lazy></v-card-media>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{project.title}}</div>
                <span class="grey--text">{{project.likes}} likes - {{project.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="showProjectCreator = !showProjectCreator" icon>
              <v-icon>{{`keyboard_arrow_${showProjectCreator ? 'up' : 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Project Creator Tile -->
          <v-slide-y-transition>
            <v-card-text v-show="showProjectCreator" class="grey lighten-4">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="project.createdBy.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{project.createdBy.username}}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin">Added {{formatCreatedDate(project.createdDate)}}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="info" @click="showMoreProjects">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import moment from "moment";
import { INFINITE_SCROLL_PROJECTS } from "../../queries";

const pageSize = 2;

export default {
  name: "Projects",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showProjectCreator: false
    };
  },
  apollo: {
    infiniteScrollProjects: {
      query: INFINITE_SCROLL_PROJECTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToProject(projectId) {
      this.$router.push(`/projects/${projectId}`);
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format("ll");
    },
    showMoreProjects() {
      this.pageNum += 1;
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollProjects.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          console.log("previous result", prevResult.infiniteScrollProjects.projects);
          console.log("fetch more result", fetchMoreResult);

          const newProjects = fetchMoreResult.infiniteScrollProjects.projects;
          const hasMorePro = fetchMoreResult.infiniteScrollProjects.hasMorePro;
          this.showMoreEnabled = hasMorePro;

          return {
            infiniteScrollProjects: {
              __typename: prevResult.infiniteScrollProjects.__typename,
              // Merge previous projects with new projects
              projects: [...prevResult.infiniteScrollProjects.projects, ...newProjects],
              hasMorePro
            }
          };
        }
      });
    }
  }
};
</script>
