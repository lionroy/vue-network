import { gql } from "apollo-boost";

/* Posts Queries */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      createdBy {
        _id
      }
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm) {
      _id
      title
      description
      imageUrl
      likes
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
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
      projects {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/* Posts Mutations */
export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
    }
  }
`;

export const UPDATE_USER_POST = gql`
  mutation(
    $postId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_POST = gql`
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      _id
    }
  }
`;

export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(
      messageBody: $messageBody
      userId: $userId
      postId: $postId
    ) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

/* Projects Actions */
export const GET_PROJECTS = gql`
  query {
    getProjects {
      _id
      title
    }
  }
`;

export const GET_PROJECT = gql`
  query($projectId: ID!) {
    getProject(projectId: $projectId) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const SEARCH_PROJECTS = gql`
  query($searchTerm: String) {
    searchProjects(searchTerm: $searchTerm) {
      _id
      title
      description
    }
  }
`;

export const GET_USER_PROJECTS = gql`
  query($userId: ID!) {
    getUserProjects(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
    }
  }
`;

export const INFINITE_SCROLL_PROJECTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollProjects(pageNum: $pageNum, pageSize: $pageSize) {
      hasMorePro
      projects {
        _id
        title
        categories
        description
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/* Projects Mutations */
export const ADD_PROJECT = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addProject(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      _id
      title
      imageUrl
      categories
      description
    }
  }
`;

export const UPDATE_USER_PROJECT = gql`
  mutation(
    $projectId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String
    $categories: [String]!
    $description: String!
  ) {
    updateUserProject(
      projectId: $projectId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_PROJECT = gql`
  mutation($projectId: ID!) {
    deleteUserProject(projectId: $projectId) {
      _id
    }
  }
`;

export const ADD_PROJECT_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $projectId: ID!) {
    addProjectMessage(
      messageBody: $messageBody
      userId: $userId
      projectId: $projectId
    ) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`;

export const LIKE_PROJECT = gql`
  mutation($projectId: ID!, $username: String!) {
    likeProject(projectId: $projectId, username: $username) {
      likes
      UserProjects {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_PROJECT = gql`
  mutation($projectId: ID!, $username: String!) {
    unlikeProject(projectId: $projectId, username: $username) {
      likes
      UserProjects {
        _id
        title
        imageUrl
      }
    }
  }
`;

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
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
