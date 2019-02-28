import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from './components/Shared/FormAlert';

// register Global component
Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

// setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  //include auth token with requests made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // if no token with key of 'token' in local storage then add import PropTypes from 'prop-types'
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    // operation adda token to authorization headers which is ent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
      }
    }
  }
});

const ApolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: ApolloProvider.provide(),
  router,
  store,
  render: h => h(App),
  created() {
    // execute getCurrent query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount("#app");
