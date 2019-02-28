import { gql } from "apollo-boost";

/*  Posts Queries */

export const GET_POSTS = gql`
query {
  getPosts {
    _id
    title
    imageUrl
  }
}
`;

/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

/* Post Mutations */
/* User Mutations */
export const SIGNIN_USER = gql`
mutation($username: String!, $password: String!) {
  signinUser(username: $username, password: $password) {
    token
  }
}
`;

export const SIGNUP_USER = gql`
mutation($username: String!, $email: String!, $password: String!) {
  signinUser(username: $username, email: $email, password: $password) {
    token
  }
}
`;