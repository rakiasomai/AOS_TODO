const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../helpers/check-auth");
const Task = require("../../mock-up/Task");

module.exports = {
  Mutation: {
    createComment: async (_, { taskId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not empty",
          },
        });
      }

      const task = await Task.findById(taskId);

      if (task) {
        task.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await task.save();
        return task;
      } else throw new UserInputError("Task not found");
    },
    async deleteComment(_, { taskId, commentId }, context) {
      const { username } = checkAuth(context);

      const task = await Task.findById(taskId);

      if (task) {
        const commIndx = task.comments.findIndex((c) => c.id === commentId);

        if (task.comments[commIndx].username === username) {
          task.comments.splice(commIndx, 1);
          await task.save();
          return task;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Task not found");
      }
    },
  },
};