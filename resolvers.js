const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Post"
      });
      return user;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score to provide best match
          { score: { $meta: "textScore" } }
          // Sort results according to that textScore (as well as by likes in descending order)
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // If page number is greater than one, figure out how many documents to skip
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    },
    /* Projects Section */
    getProjects: async (_, args, { Project }) => {
      const projects = await Project.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return projects;
    },
    getUserProjects: async (_, { userId }, { Project }) => {
      const projects = await Project.find({
        createdBy: userId
      });
      return projects;
    },
    getProject: async (_, { projectId }, { Project }) => {
      const project = await Project.findOne({ _id: projectId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return project;
    },
    searchProjects: async (_, { searchTerm }, { Project }) => {
      if (searchTerm) {
        const searchResults = await Project.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score to provide best match
          { score: { $meta: "textScore" } }
          // Sort results according to that textScore (as well as by likes in descending order)
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    infiniteScrollProjects: async (_, { pageNumPro, pageSizePro }, { Project }) => {
      let projects;
      if (pageNumPro === 1) {
        projects = await Project.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSizePro);
      } else {
        // If page number is greater than one, figure out how many documents to skip
        const skipsPro = pageSizePro * (pageNumPro - 1);
        projects = await Project.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skipsPro)
          .limit(pageSizePro);
      }
      const totalDocsPro = await Project.countDocuments();
      const hasMorePro = totalDocsPro > pageSizePro * pageNumPro;
      return { projects, hasMorePro };
    }
  },
  Mutation: {
    /* Posts Mutations */
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    updateUserPost: async (
      _,
      { postId, userId, title, imageUrl, categories, description },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        // Find post by postId and createdBy
        { _id: postId, createdBy: userId },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return post;
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // find post by id
        { _id: postId },
        // prepend (push) new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, add 1 to its 'like' value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      // Find User, add id of post to its favorites array (which will be populated as Posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      // Return only likes from 'post' and favorites from 'user'
      return { likes: post.likes, favorites: user.favorites };
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, add -1 to its 'like' value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      // Find User, remove id of post from its favorites array (which will be populated as Posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      // Return only likes from 'post' and favorites from 'user'
      return { likes: post.likes, favorites: user.favorites };
    },
    /* Project Mutations */
    addProject: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Project }
    ) => {
      const newProject = await new Project({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newProject;
    },
    updateUserProject: async (
      _,
      { projectId, userId, title, imageUrl, categories, description },
      { Project }
    ) => {
      const project = await Project.findOneAndUpdate(
        // Find project by projectId and createdBy
        { _id: projectId, createdBy: userId },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return project;
    },
    deleteUserProject: async (_, { projectId }, { Project }) => {
      const project = await Project.findOneAndRemove({ _id: projectId });
      return project;
    },
    addProjectMessage: async (_, { messageBody, userId, projectId }, { Project }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const project = await Project.findOneAndUpdate(
        // find project by id
        { _id: projectId },
        // prepend (push) new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return project.messages[0];
    },
    likeProject: async (_, { projectId, username }, { Project, User }) => {
      // Find Project, add 1 to its 'like' value
      const project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      // Find User, add id of project to its userProjects array (which will be populated as Projects)
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { userProjects: projectId } },
        { new: true }
      ).populate({
        path: "userProjects",
        model: "Project"
      });
      // Return only likes from 'project' and projects from 'user'
      return { likes: project.likes, userProjects: user.projects };
    },
    unlikeProject: async (_, { projectId, username }, { Project, User }) => {
      // Find Project, add -1 to its 'like' value
      const project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      // Find User, remove id of project from its userProjects array (which will be populated as Projects)
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { userProjects: projectId } },
        { new: true }
      ).populate({
        path: "userProjects",
        model: "Project"
      });
      // Return only likes from 'project' and projects from 'user'
      return { likes: project.likes, userProjects: user.projects };
    },
 /* Project mutation ended */
    
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
