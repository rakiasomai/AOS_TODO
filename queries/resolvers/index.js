const tasksResolvers = require("./tasks");

const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  Task: {
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...tasksResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...tasksResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...tasksResolvers.Subscription,
  },
};