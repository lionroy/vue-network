import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";

import Dashboard from "./components/Projects/Dashboard.vue";
import AddProject from './components/Projects/AddProject.vue';
import Project from './components/Projects/Project.vue';
import Projects from './components/Projects/Projects.vue';

import AddPost from "./components/Posts/AddPost.vue";
import Posts from "./components/Posts/Posts.vue";
import Post from "./components/Posts/Post.vue";

import Profile from "./components/Auth/Profile.vue";
import Signin from "./components/Auth/Signin.vue";
import Signup from "./components/Auth/Signup.vue";

import AuthGuard from "./AuthGuard";

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
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true
    },
    {
      path: "/post/add",
      name: "AddPost",
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: "/projects",
      name: "Projects",
      component: Projects
    },
    {
      path: "/projects/:projectId",
      name: "Project",
      component: Project,
      props: true
    },
    {
      path: "/project/add",
      name: "AddProject",
      component: AddProject,
      beforeEnter: AuthGuard
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/Signup",
      name: "Signup",
      component: Signup
    }
  ]
});
